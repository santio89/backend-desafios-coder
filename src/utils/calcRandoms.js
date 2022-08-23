process.on('message', message => {
    const obj = {}

    for (i = 0; i < message; i++) {
        const rand = Math.floor(Math.random() * 1000 + 1);

        if (obj.hasOwnProperty(`${rand}`)) {
            obj[`${rand}`]++;
        } else {
            obj[`${rand}`] = 1;
        }
    }

    process.send(obj);
    process.exit()
})