"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategoryProps = exports.validateWalletProps = exports.validatePropsTransaction = exports.validBodyPropsBeforeUpdate = void 0;
const validBodyPropsBeforeUpdate = (allowedProps) => {
    return (req, res, next) => {
        const receivedProps = Object.keys(req.body);
        const unexpectedProps = receivedProps.filter((prop) => !allowedProps.includes(prop));
        if (unexpectedProps.length > 0) {
            return res
                .status(400)
                .json({ error: `Unexpected properties: ${unexpectedProps.join(", ")}` });
        }
        next();
    };
};
exports.validBodyPropsBeforeUpdate = validBodyPropsBeforeUpdate;
const allowedTransactionProps = ["description", "amount", "categoryId", "walletId", "date"];
exports.validatePropsTransaction = (0, exports.validBodyPropsBeforeUpdate)(allowedTransactionProps);
const allowedWalletProps = ["name", "balance"];
exports.validateWalletProps = (0, exports.validBodyPropsBeforeUpdate)(allowedWalletProps);
const allowedCategoryProps = ["name"];
exports.validateCategoryProps = (0, exports.validBodyPropsBeforeUpdate)(allowedCategoryProps);
