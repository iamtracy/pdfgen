interface GeneratePdf {
    generatePdf(pdf:  Pdf, total: number): string;
}

type InvoiceItemRow = {
    billRate?: string,
    billRateType?: string,
    clientName?: string,
    firstName?: string;
    freelancerId?: string;
    freelancerName?: string;
    hours?: string;
    lastName?: string;
    payIn?: number;
    payoutRateType?: string;
    phId?: string;
    projectId?: null | string;
    projectName?: string;
    service?: null | string;
    serviceId?: string;
};

interface Pdf {
    accountManagerId: string;
    clientEmail: string;
    clientFirstName: null | string;
    clientLastName: null | string;
    clientId: string;
    clientInvoiceStatus: string;
    clientName: string;
    clientTotal: number;
    firstName: string;
    guid: string;
    invoiceId: string;
    lastName: string;
    total: number;
    pdfData: Array<InvoiceItemRow>;
    search: {
        month: string;
        year: string;
    };
    viewOnly: boolean;
}

export { GeneratePdf, Pdf };