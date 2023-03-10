import { writeFileSync } from "fs"
import generateReadme from "./readme"


async function main () {
  const readme = await generateReadme()

  writeFileSync('README.md', readme)
}

main()