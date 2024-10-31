import { Parser as Json2csvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';

/**
 * @desc Export transactions to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Buffer>}
 */
export const exportToCSV = async transactions => {
  try {
    const fields = ['date', 'type', 'category', 'amount', 'notes'];
    const json2csvParser = new Json2csvParser({ fields });
    const csvData = json2csvParser.parse(transactions);

    return Buffer.from(csvData, 'utf-8');
  } catch (error) {
    console.error('Error exporting to CSV:', error.message);
    throw error;
  }
};

/**
 * @desc Export transactions to PDF format
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Buffer>}
 */
export const exportToPDF = async transactions => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add title
      doc.fontSize(18).text('Transaction Report', { align: 'center' });
      doc.moveDown();

      // Add table headers
      doc.fontSize(12);
      doc.text('Date', 50, doc.y, { continued: true });
      doc.text('Type', 150, doc.y, { continued: true });
      doc.text('Category', 250, doc.y, { continued: true });
      doc.text('Amount', 350, doc.y, { continued: true });
      doc.text('Notes', 450, doc.y);
      doc.moveDown();

      // Add transactions
      transactions.forEach(txn => {
        doc.text(txn.date.toISOString().split('T')[0], 50, doc.y, {
          continued: true,
        });
        doc.text(txn.type, 150, doc.y, { continued: true });
        doc.text(txn.category, 250, doc.y, { continued: true });
        doc.text(`$${txn.amount.toFixed(2)}`, 350, doc.y, { continued: true });
        doc.text(txn.notes || '', 450, doc.y);
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      console.error('Error exporting to PDF:', error.message);
      reject(error);
    }
  });
};

/**
 * @desc Export transactions to Excel format
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Buffer>}
 */
export const exportToExcel = async transactions => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Add columns
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];

    // Add rows
    transactions.forEach(txn => {
      worksheet.addRow({
        date: txn.date.toISOString().split('T')[0],
        type: txn.type,
        category: txn.category,
        amount: txn.amount,
        notes: txn.notes,
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error('Error exporting to Excel:', error.message);
    throw error;
  }
};

/**
 * @desc Export transactions to JSON format
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Buffer>}
 */
export const exportToJSON = async transactions => {
  try {
    const jsonData = JSON.stringify(transactions, null, 2);
    return Buffer.from(jsonData, 'utf-8');
  } catch (error) {
    console.error('Error exporting to JSON:', error.message);
    throw error;
  }
};

/**
 * @desc Export transactions to ZIP format containing all formats
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Buffer>}
 */
export const exportToZIP = async transactions => {
  try {
    const zip = new JSZip();

    // Add CSV file
    const csvBuffer = await exportToCSV(transactions);
    zip.file('transactions.csv', csvBuffer);

    // Add PDF file
    const pdfBuffer = await exportToPDF(transactions);
    zip.file('transactions.pdf', pdfBuffer);

    // Add Excel file
    const excelBuffer = await exportToExcel(transactions);
    zip.file('transactions.xlsx', excelBuffer);

    // Add JSON file
    const jsonBuffer = await exportToJSON(transactions);
    zip.file('transactions.json', jsonBuffer);

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    return zipBuffer;
  } catch (error) {
    console.error('Error exporting to ZIP:', error.message);
    throw error;
  }
};
