import express from 'express'
import { spawnSync } from 'child_process'
const app = express()
const port = 7777

const run = (cmd, params) => {
    result = spawnSync(cmd, params);

    // Check if there was an error
    if (result.error) {
        console.error('Error:', result.error);
        return;
    }

    // Print the output of the command
    console.log(result.stdout.toString());
}

app.post('/2c285354-e7a8-45f4-a82f-96cb150ea9fc', (req, res) => {
    console.log('Got build request from', req.hostname, req.ip);

    run('npm', ['run', 'build']);
    run('npm', ['run', 'publish']);
    run('git', ['push', 'web']);

    res.send('Site built.\n\n')
})

// app.get('/', (req, res) => {
//     console.log('Hello World 2!')
//     res.send('Hello World 2!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})