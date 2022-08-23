process.on('message', cantidad => {
    const obj = {}

    for (i = 0; i < cantidad; i++) {
        const rand = Math.floor(Math.random() * 1000 + 1);

        if (obj.hasOwnProperty(rand)) {
            obj[rand]++;
        }
         else {
            obj[rand] = 1;
        }
    }

    process.send(obj);
    process.exit()
})