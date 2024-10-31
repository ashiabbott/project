import Transaction from '../models/Transaction.js';
import {
  exportToCSV,
  exportToPDF,
  exportToExcel,
  exportToJSON,
  exportToZIP,
} from '../services/exportService.js';

/**
 * @desc    Export transactions in the specified format with optional filters
 * @route   GET /api/export/transactions
 * @access  Private
 */
export const exportTransactions = async (req, res) => {
  try {
    // Extract query parameters
    const { format, startDate, endDate, type, category } = req.query;

    // Validate the format parameter
    const allowedFormats = ['csv', 'pdf', 'excel', 'json', 'zip'];
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ success: false, message: 'Invalid format specified' });
    }

    // Build query filters
    const filters = { user: req.user.id };
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      filters.category = category;
    }

    // Fetch transactions based on filters
    const transactions = await Transaction.find(filters).lean();

    // Check if any transactions were found
    if (transactions.length === 0) {
      return res.status(404).json({ success: false, message: 'No transactions found for the specified filters' });
    }

    // Export transactions based on the specified format
    let fileBuffer;
    let fileName;
    switch (format) {
      case 'csv':
        fileBuffer = await exportToCSV(transactions);
        fileName = 'transactions.csv';
        break;
      case 'pdf':
        fileBuffer = await exportToPDF(transactions);
        fileName = 'transactions.pdf';
        break;
      case 'excel':
        fileBuffer = await exportToExcel(transactions);
        fileName = 'transactions.xlsx';
        break;
      case 'json':
        fileBuffer = await exportToJSON(transactions);
        fileName = 'transactions.json';
        break;
      case 'zip':
        fileBuffer = await exportToZIP(transactions);
        fileName = 'transactions.zip';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid format specified' });
    }

    // Set response headers for file download
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    // Send the file buffer as the response
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error exporting transactions:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
