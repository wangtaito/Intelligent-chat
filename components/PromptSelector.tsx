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
  const [showModal, setShowModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const handleSelect = (prompt: (typeof prompts)[0]) => {
    setSelectedPrompt(prompt);
    onSelect(prompt.content);
    setShowModal(false);
  };

  return (
    <div className="flex relative justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="flex gap-2 items-center px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span>對話角色：{selectedPrompt.title}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showModal && (
        <div className="overflow-hidden absolute right-0 left-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          {prompts.map((prompt) => (
            <button
              key={prompt.title}
              onClick={() => handleSelect(prompt)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                ${
                  prompt.title === selectedPrompt.title
                    ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-200"
                }`}
            >
              {prompt.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
