import { Request, Response, NextFunction } from "express";

export const validBodyPropsBeforeUpdate = (allowedProps: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
const allowedTransactionProps = ["description", "amount", "categoryId", "walletId", "date"];
export const validatePropsTransaction = validBodyPropsBeforeUpdate(allowedTransactionProps);

const allowedWalletProps = ["name", "balance"];
export const validateWalletProps = validBodyPropsBeforeUpdate(allowedWalletProps);

const allowedCategoryProps = ["name"];
export const validateCategoryProps = validBodyPropsBeforeUpdate(allowedCategoryProps);
