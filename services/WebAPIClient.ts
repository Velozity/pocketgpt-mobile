import { IAccount } from "@providers/AccountProvider";

type ILoginResponse = {
  success?: boolean;
  account?: IAccount;
  token?: string;
  error?: string;
};

type IMessageResponse = {
  text: string;
  createdAt: string;
  title?: string;
  error?: string;
};

export default class WebAPIClient {
  private baseURL: string;
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.baseURL = "http://192.168.0.11:3000/api";
    this.accessToken = accessToken;
  }

  private getAuthorizationHeader(): { [key: string]: string } {
    if (this.accessToken) {
      return { Authorization: `Bearer ${this.accessToken}` };
    }
    return {};
  }

  async postMessageSSE(
    endpoint: string,
    body: any,
    onPartial: (data: string, index: number) => void
  ): Promise<IMessageResponse> {
    const xhr = new XMLHttpRequest();
    return new Promise<IMessageResponse>((resolve, reject) => {
      xhr.open("POST", `${this.baseURL}${endpoint}`);
      xhr.setRequestHeader("Content-Type", "application/json");
      const authHeader = this.getAuthorizationHeader();
      if (authHeader) {
        xhr.setRequestHeader("Authorization", authHeader.Authorization);
      }
      xhr.setRequestHeader("Accept", "text/event-stream");
      xhr.timeout = 0;
      let count = 1;
      const dataHandler = (data: string) => {
        try {
          const parsed = JSON.parse(data);
          console.log(parsed);
          if (parsed.type === "partial") {
            onPartial(parsed.text, count);
            count++;
          } else if (parsed.type === "complete") {
            console.log("ended");
            resolve(parsed);
          }
        } catch (err) {
          console.log(err);
        }
      };
      const errorHandler = () => {
        xhr.abort();
        reject();
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3) {
          const data = xhr.responseText.trim();
          if (data.length > 0) {
            const line = data.split("\n\n").pop();

            if (line && line.trim() !== "") {
              dataHandler(line);
            }
          }
        }
      };
      xhr.addEventListener("error", errorHandler);
      xhr.addEventListener("timeout", errorHandler);
      xhr.send(JSON.stringify(body));
    });
  }

  async sendMessage(chatId: string, text: string, onPartial: any) {
    return this.postMessageSSE(`/chat/${chatId}/message`, { text }, onPartial);
  }

  async retrieveChats() {
    return await this.get("/me/chats");
  }

  async retrieveMessages(chatId: string, page: number) {
    return await this.get(`/chat/${chatId}?page=${page}`);
  }

  async deleteChats(chatIds: string[]) {
    return await this.delete(`/me/chats?chatIds=${JSON.stringify(chatIds)}`);
  }

  async createChat() {
    return await this.post("/chat");
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const response: ILoginResponse = await this.post("/auth/credentials", {
      email,
      password,
    }).catch((e) => e);

    if (response) {
      return response;
    } else {
      return {
        error: "Please try again soon.",
      };
    }
  }

  async me() {
    return await this.get("/me");
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.getAuthorizationHeader(),
    });

    const data = await response.json();
    return data;
  }

  async post(endpoint: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        ...this.getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return data;
  }

  async put(endpoint: string, body: any): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: {
        ...this.getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  async delete(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthorizationHeader(),
    });
    const data = await response.json();
    return data;
  }
}
