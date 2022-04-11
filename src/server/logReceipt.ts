const logReceipt = async (receipt: any) => {
    const { fields } = receipt
    console.log("Merchant Name:", fields.merchantName?.value);
    console.log('Merchant Aliases:')
    for (const alias of fields.merchantAliases?.values ?? []) {
        console.log("", alias.value)
    }
    console.log("Merchant Address:", fields.merchantAddress?.value);
    console.log("Merchant Phone:", fields.merchantPhoneNumber?.value);
    console.log("Receipt Type:", fields.receiptType?.value);
    console.log("Transaction Currency:", fields.currency?.value);

    console.log("Items:");
    for (const { properties: item } of fields.items?.values ?? []) {
        console.log("-", item.name?.value);
        console.log("  Description:", item.description?.value);
        console.log("  Date:", item.date?.value);
        console.log("  Unit Price:", item.price?.value);
        console.log("  Quantity:", item.quantity?.value);
        console.log("  Total Price:", item.totalPrice?.value);
        console.log("  Category:", item.category?.value);
    }

    console.log("Transaction Date:", fields.transactionDate?.value);
    console.log("Transaction Time:", fields.transactionTime?.value);
    console.log("Subtotal:", fields.subtotal?.value);
    console.log("Tip:", fields.tip?.value);
    console.log("Tax:", fields.tax?.value);
    console.log("Total:", fields.total?.value);
}

export default logReceipt