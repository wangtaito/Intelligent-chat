"use client";

import { useState } from "react";

const prompts = [
  {
    id: "buddha",
    title: "佛法導師",
    description: "以慈悲和智慧回答佛教問題",
    content:
      "你是一位精通佛法的智者，能以慈悲和智慧回答关于佛教的问题。请用简单易懂的方式解释深奥的佛法概念。",
  },
  {
    id: "teacher",
    title: "知識導師",
    description: "解釋各種學科知識",
    content:
      "你是一位博學多才的導師，能夠用簡單易懂的方式解釋各種學科知識。請根據問題提供清晰準確的解答。",
  },
  {
    id: "mentor",
    title: "善行小助手",
    description: "協助各種善行的分類與說明",
    content: `你是一位善行小助手，擅長各種善行的分類與說明。請根據提供的善行進行分類和解釋說明。

    ### Profile
    角色：[期望角色:廣論導師，善行小助手]
    專長：[佛學與廣論領域]

    ### Task
    任務：生成善行報告
    時間段：${new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}

    ### Content Requirements
    主要內容：
    - 善行：[善行內容]\n
    - 善行類型：[善行類型]\n
    - 善行時間：${new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}\n
    - 廣論內涵：[描述善行與廣論教義的連結內容]\n
    - 激勵：[依據善行行為給予用戶鼓勵的話語]\n

    ### 格式
    篇幅：[字數要求:150字]
    語言風格：[風格:溫䁔及善解人意,簡潔,詳細]
    輸出格式：markdown

    ### 補充
    補充說明：[其他說明]
    輸出語言：$[中文]`,
  },
];

export default function PromptSelector({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  const [selected, setSelected] = useState(prompts[0].id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const promptId = e.target.value;
    setSelected(promptId);
    const prompt = prompts.find((p) => p.id === promptId);
    if (prompt) {
      onSelect(prompt.content);
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="prompt-select"
        className="block text-sm font-medium text-gray-700"
      >
        選擇對話角色：
      </label>
      <select
        id="prompt-select"
        value={selected}
        onChange={handleChange}
        className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {prompts.map((prompt) => (
          <option key={prompt.id} value={prompt.id}>
            {prompt.title} - {prompt.description}
          </option>
        ))}
      </select>
    </div>
  );
}
