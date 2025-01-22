'use client'

import { useState } from 'react'

const prompts = [
  {
    id: 'buddha',
    title: '佛法導師',
    description: '以慈悲和智慧回答佛教問題',
    content: '你是一位精通佛法的智者，能以慈悲和智慧回答关于佛教的问题。请用简单易懂的方式解释深奥的佛法概念。'
  },
  {
    id: 'teacher',
    title: '知識導師',
    description: '解釋各種學科知識',
    content: '你是一位博學多才的導師，能夠用簡單易懂的方式解釋各種學科知識。請根據問題提供清晰準確的解答。'
  },
  {
    id: 'writer',
    title: '寫作助手',
    description: '協助創作各種文體',
    content: '你是一位專業的寫作助手，擅長各種文體的創作。請根據需求提供寫作建議和範例。'
  }
]

export default function PromptSelector({ onSelect }: { onSelect: (prompt: string) => void }) {
  const [selected, setSelected] = useState(prompts[0].id)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const promptId = e.target.value
    setSelected(promptId)
    const prompt = prompts.find(p => p.id === promptId)
    if (prompt) {
      onSelect(prompt.content)
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor="prompt-select" className="block text-sm font-medium text-gray-700">
        選擇對話角色：
      </label>
      <select
        id="prompt-select"
        value={selected}
        onChange={handleChange}
        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {prompts.map(prompt => (
          <option key={prompt.id} value={prompt.id}>
            {prompt.title} - {prompt.description}
          </option>
        ))}
      </select>
    </div>
  )
}
