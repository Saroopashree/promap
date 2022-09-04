const { Hop } = require("@onehop/js");
const dotenv = require("dotenv");

dotenv.config();

const HOP_PROJECT_ID = process.env.HOP_PROJECT_ID;
const HOP_PROJECT_TOKEN = process.env.HOP_PROJECT_TOKEN;

const hop = new Hop(HOP_PROJECT_TOKEN);

export default hop;
