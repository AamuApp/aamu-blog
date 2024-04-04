import express from 'express'
import { execSync } from 'child_process'
const app = express()
const port = 7777

const run = (command) => {
    try {
        // Execute the command synchronously
        const output = execSync(command);

        // Print the output of the command
        console.log('Output:', output.toString());
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    }
}

app.post('/2c285354-e7a8-45f4-a82f-96cb150ea9fc', (req, res) => {
    console.log('Got build request from', req.hostname, req.ip);

    run('pwd');
    run('node build-with-graphql.js');
    run('hugo');
    run('git add .');
    run('git commit -am "..."');
    run('git push web');
    run('git push origin');
    // console.log('*** push')
    // run('pwd');
    // run('git push', 'web');
    // run('git push', 'origin');

    res.send('Site built.\n\n')
})

// app.get('/', (req, res) => {
//     console.log('Hello World 2!')
//     res.send('Hello World 2!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})