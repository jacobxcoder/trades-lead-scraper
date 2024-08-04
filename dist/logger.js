"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const signale_1 = require("signale");
const options = {
    disabled: false,
    interactive: false,
    secrets: [],
    stream: process.stdout,
};
exports.logger = new signale_1.Signale(options);
exports.default = exports.logger;
