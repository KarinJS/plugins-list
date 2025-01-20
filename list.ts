import { Plugin } from "./src/types"

const list: Plugin[] = [
  {
    name: '基础插件',
    package_name: 'karin-plugin-basic',
    type: 'npm',
    description: 'karin plugin basic',
    license: 'MIT',
    time: '2025-01-19 10:00:00',
    author: [
      {
        name: 'shijin',
        email: 'shijin520@gmail.com',
        home: 'https://github.com/sj817',
      },
    ],
    repo: [
      {
        type: 'github',
        url: 'https://github.com/karinjs/karin-plugin-basic',
      },
    ],
  }
]

export default list
