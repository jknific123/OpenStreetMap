const { exec } = require('child_process');

const getPointsOfInterest = async (req, res) => {

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const distance = req.body.distance;
    const tags = JSON.stringify(req.body.tags).replace(/"/g, '\\"'); // escape double quotes

    // console.log('recived tags: ', req.body.tags)
    // console.log('stringified tags: ', tags)


    exec(`python ./python_scripts/points_of_interest.py ${latitude} ${longitude} ${distance} "${tags}"`, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => { // double quotes around tags
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send(error);
            return;
        }

        // Parse the Python script's output (stdout) to a JavaScript object
        const results = JSON.parse(stdout);

        // Send the results to the client
        res.send(results);
        // res.send(stdout);
    });

};


module.exports = {
    getPointsOfInterest
}

