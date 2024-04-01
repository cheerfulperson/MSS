const { exec } = require("child_process");
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
})

async function invoke() {
  const promises = [];
  let counter = 0;
  for (let index = 0; index < 100; index++) {
    promises.push(
      new Promise((res) => {
        exec(
          'echo http://admin:@$(curl -Ls git.io/c4 | grep videostream | shuf | head -n1 | cut -d "/" -f3)',
          (err, stdout) => {
            if (err) {
              console.error(`exec error: ${err}`);
              res(err);
              return;
            }
            counter++;
            rl.write(`${index}%`);
            res(stdout);
          }
        );
      })
    );
  }
  return Promise.all(promises);
}

invoke().then((urls) => {
  console.log(urls);
});
