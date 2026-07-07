export const responseTimeMiddleware = (req, res, next) => {

    const start = process.hrtime.bigint();

    res.on("finish", () => {

        const end = process.hrtime.bigint();

        const responseTime =
            Number(end - start) / 1000000;

        console.log(
            `${req.method} ${req.originalUrl} | ${responseTime.toFixed(2)} ms`
        );

    });

    next();

};