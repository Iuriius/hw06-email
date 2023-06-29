const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");
const { PASS } = process.env;

const configOptions = {
	host: "smtp.mail.yahoo.com",
	sequre: true,
	port: 465,
	auth: {
		user: "test.555@yahoo.com",
		pass: PASS,
		rejectUnauthorized: true,
		minVersion: "TLSv1.2",
	},
};
const transport = nodemailer.createTransport(configOptions);

const email = {
	to: "kinedav149@huvacliq.com",
	from: "test.555@yahoo.com",
	subject: "Test email",
	html: "<p><strong>Test email</strong> from localhost:3000</p>",
};

transport
	.sendMail(email)
	.then(() => console.log("Email send success"))
	.catch(error => console.log(error.message));

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

module.exports = app;
