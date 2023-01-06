import generateReadme from './readme';

async function main () {
  const readme = await generateReadme()

  console.log(readme)
}

main()