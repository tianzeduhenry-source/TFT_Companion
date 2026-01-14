
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePatchNotes = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请作为一名顶尖云顶之弈(TFT)教练，分析以下版本更新内容并给出解读：\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "版本核心变动概述" },
          buffs: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "重要的加强项"
          },
          nerfs: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "重要的削弱项"
          },
          topComps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "版本初期推荐的上分阵容"
          }
        },
        required: ["summary", "buffs", "nerfs", "topComps"]
      },
      systemInstruction: "你是一个专业的云顶之弈策略分析师，擅长从复杂的数据变动中总结出核心玩法变动。回复语言请使用中文。"
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const fetchAndAnalyzeOfficialPatch = async (version?: string) => {
  const query = version 
    ? `Find the official Teamfight Tactics patch notes for version ${version} from leagueoflegends.com and analyze it.`
    : `Find the latest official Teamfight Tactics patch notes from leagueoflegends.com and analyze it.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          version: { type: Type.STRING },
          summary: { type: Type.STRING },
          buffs: { type: Type.ARRAY, items: { type: Type.STRING } },
          nerfs: { type: Type.ARRAY, items: { type: Type.STRING } },
          topComps: { type: Type.ARRAY, items: { type: Type.STRING } },
          officialUrl: { type: Type.STRING }
        },
        required: ["version", "summary", "buffs", "nerfs", "topComps", "officialUrl"]
      },
      systemInstruction: "你是一个专门负责爬取并分析云顶之弈官方补丁说明的助手。利用 Google Search 找到官网原文，提取核心变动。必须确保数据真实准确。回复语言为中文。"
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI patch notes", e);
    return null;
  }
};

export const getRecentVersionsList = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "请列出最近 5 个云顶之弈的补丁版本号（例如 15.3, 15.2, 15.1, 14.24, 14.23），并附带大致发布日期。",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            version: { type: Type.STRING },
            date: { type: Type.STRING },
            title: { type: Type.STRING }
          },
          required: ["version", "date", "title"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [
      { version: "15.3", date: "2025-02", title: "当前版本" },
      { version: "15.2", date: "2025-01", title: "上个版本" }
    ];
  }
};

export const chatWithCoach = async (message: string, history: {role: 'user'|'model', parts: {text: string}[]}[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是一个热情的云顶之弈教练，了解所有的羁绊、英雄和装备。你会用幽默且专业的方式回答玩家关于阵容选择、装备合成和运营策略的问题。"
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const fetchPlayerRank = async (playerName: string, region: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `请帮我查询云顶之弈(TFT)玩家战绩。玩家名: ${playerName}, 服务器: ${region}`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          playerName: { type: Type.STRING },
          region: { type: Type.STRING },
          rank: { type: Type.STRING },
          lp: { type: Type.STRING },
          winRate: { type: Type.STRING },
          top4Rate: { type: Type.STRING },
          recentGames: { type: Type.ARRAY, items: { type: Type.STRING } },
          sourceUrl: { type: Type.STRING }
        },
        required: ["playerName", "region", "rank", "lp", "sourceUrl"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
};
