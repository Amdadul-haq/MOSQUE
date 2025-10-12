// src/services/pdf-service.ts - Fixed with correct FileSystem API for v19+
import { PDFReportData, PDFExportConfig } from '../types/pdf-report';
import { formatCurrency } from '../utils/formatters';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export class PDFService {
  static async generateFinancialReport(
    data: PDFReportData, 
    config: PDFExportConfig
  ): Promise<string> {
    try {
      // Create HTML content for PDF
      const htmlContent = this.generateHTMLContent(data, config);
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const fileName = `Financial_Report_${data.reportPeriod.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      
      // Get the directory path from the generated URI
      const originalDir = uri.substring(0, uri.lastIndexOf('/'));
      const newPath = `${originalDir}/${fileName}`;
      
      // Move file to new location with proper name
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      });

      // Save to gallery
      await this.saveToGallery(newPath);
      
      return fileName;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private static generateHTMLContent(data: PDFReportData, config: PDFExportConfig): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Financial Report - ${data.mosqueName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #333;
            line-height: 1.6;
          }
          .cover-page {
            text-align: center;
            padding: 80px 20px;
            min-height: 600px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .mosque-name {
            font-size: 32px;
            color: #16a34a;
            margin-bottom: 30px;
            font-weight: bold;
          }
          .report-title {
            font-size: 28px;
            margin-bottom: 40px;
            color: #000;
            font-weight: bold;
          }
          .report-period {
            font-size: 20px;
            margin-bottom: 25px;
            color: #666;
          }
          .summary-box {
            background: #f8f9fa;
            padding: 40px;
            margin: 50px auto;
            border-radius: 12px;
            max-width: 600px;
            border-left: 6px solid #16a34a;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .summary-title {
            font-size: 24px;
            margin-bottom: 25px;
            color: #000;
            font-weight: bold;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 8px 0;
            font-size: 18px;
          }
          .donation {
            color: #16a34a;
            font-weight: bold;
          }
          .expense {
            color: #dc2626;
            font-weight: bold;
          }
          .balance {
            color: #000;
            font-weight: bold;
            border-top: 2px solid #ddd;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
          }
          .page-break {
            page-break-before: always;
            padding-top: 40px;
          }
          .section {
            margin-bottom: 40px;
          }
          .section-title {
            font-size: 24px;
            color: #000;
            margin-bottom: 20px;
            border-bottom: 3px solid #16a34a;
            padding-bottom: 10px;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          th {
            background: #16a34a;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 15px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .progress-bar {
            background: #e5e7eb;
            border-radius: 10px;
            height: 10px;
            width: 120px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            border-radius: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 60px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #16a34a;
          }
          .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #16a34a;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${this.generateCoverPage(data)}
        ${this.generateSummaryPage(data)}
        ${config.includeDetails ? this.generateBreakdownPages(data) : ''}
        ${config.includeCharts ? this.generateTrendsPage(data) : ''}
        ${this.generateFooter()}
      </body>
      </html>
    `;
  }

  private static generateCoverPage(data: PDFReportData): string {
    return `
      <div class="cover-page">
        <div class="mosque-name">${this.escapeHtml(data.mosqueName)}</div>
        <div class="report-title">FINANCIAL REPORT</div>
        <div class="report-period">Period: ${this.escapeHtml(data.reportPeriod)}</div>
        <div class="report-period">Generated: ${this.escapeHtml(data.generatedDate)}</div>
        
        <div class="summary-box">
          <div class="summary-title">Financial Summary</div>
          <div class="summary-item">
            <span>Total Donations:</span>
            <span class="donation">${formatCurrency(data.financialSummary.totalDonations)}</span>
          </div>
          <div class="summary-item">
            <span>Total Expenses:</span>
            <span class="expense">${formatCurrency(data.financialSummary.totalExpenses)}</span>
          </div>
          <div class="summary-item balance">
            <span>Net Balance:</span>
            <span>${formatCurrency(data.financialSummary.netBalance)}</span>
          </div>
        </div>
      </div>
    `;
  }

  private static generateSummaryPage(data: PDFReportData): string {
    const avgDonation = data.financialSummary.totalDonations / Math.max(data.financialSummary.donationCount, 1);
    const avgExpense = data.financialSummary.totalExpenses / Math.max(data.financialSummary.expenseCount, 1);

    return `
      <div class="page-break section">
        <div class="section-title">Detailed Financial Summary</div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.financialSummary.donationCount}</div>
            <div class="stat-label">Total Donations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.financialSummary.expenseCount}</div>
            <div class="stat-label">Total Expenses</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Amount</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total Donations</strong></td>
              <td style="color: #16a34a; font-weight: bold;">${formatCurrency(data.financialSummary.totalDonations)}</td>
              <td>${data.financialSummary.donationCount}</td>
            </tr>
            <tr>
              <td><strong>Total Expenses</strong></td>
              <td style="color: #dc2626; font-weight: bold;">${formatCurrency(data.financialSummary.totalExpenses)}</td>
              <td>${data.financialSummary.expenseCount}</td>
            </tr>
            <tr style="background: #e7f4e8;">
              <td><strong>Net Balance</strong></td>
              <td><strong style="font-size: 18px;">${formatCurrency(data.financialSummary.netBalance)}</strong></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">Monthly Averages</div>
        <table>
          <tr>
            <td><strong>Average Donation Amount</strong></td>
            <td style="color: #16a34a; font-weight: bold;">${formatCurrency(avgDonation)}</td>
          </tr>
          <tr>
            <td><strong>Average Expense Amount</strong></td>
            <td style="color: #dc2626; font-weight: bold;">${formatCurrency(avgExpense)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  private static generateBreakdownPages(data: PDFReportData): string {
    const donationBreakdown = this.generateCategoryTable(data.donationBreakdown, 'Donation Breakdown', '#16a34a');
    const expenseBreakdown = this.generateCategoryTable(data.expenseBreakdown, 'Expense Breakdown', '#dc2626');
    
    return `
      <div class="page-break">
        ${donationBreakdown}
      </div>
      <div class="page-break">
        ${expenseBreakdown}
      </div>
    `;
  }

  private static generateCategoryTable(categories: any[], title: string, color: string): string {
    return `
      <div class="section">
        <div class="section-title" style="border-bottom-color: ${color};">${title}</div>
        <table>
          <thead>
            <tr style="background: ${color};">
              <th>Category</th>
              <th>Amount</th>
              <th>Percentage</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(category => `
              <tr>
                <td><strong>${this.escapeHtml(category.category)}</strong></td>
                <td style="font-weight: bold;">${formatCurrency(category.amount)}</td>
                <td style="color: ${color}; font-weight: bold;">${category.percentage}%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${category.percentage}%; background: ${color};"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateTrendsPage(data: PDFReportData): string {
    const recentData = data.monthlyTrends.slice(-12);
    
    return `
      <div class="page-break section">
        <div class="section-title">Monthly Trends (Last 12 Months)</div>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Donations</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${recentData.map(month => `
              <tr>
                <td><strong>${this.escapeHtml(month.month)}</strong></td>
                <td style="color: #16a34a; font-weight: bold;">${formatCurrency(month.donations)}</td>
                <td style="color: #dc2626; font-weight: bold;">${formatCurrency(month.expenses)}</td>
                <td><strong>${formatCurrency(month.balance)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateFooter(): string {
    return `
      <div class="footer">
        Generated by Mosque Management System • Confidential Financial Document
      </div>
    `;
  }

  private static escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  private static async saveToGallery(filePath: string): Promise<void> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(filePath);
        const album = await MediaLibrary.getAlbumAsync('Mosque Financials');
        
        if (album === null) {
          await MediaLibrary.createAlbumAsync('Mosque Financials', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } else {
        throw new Error('Gallery permission denied');
      }
    } catch (error) {
      console.error('Save to gallery error:', error);
      // Don't throw error here, just log it
    }
  }

  static async generateExcelExport(data: PDFReportData): Promise<string> {
    try {
      // Create CSV content for Excel export
      const csvContent = this.getExcelTemplate(data);
      const fileName = `Financial_Data_${data.reportPeriod.replace(/\s+/g, '_')}_${Date.now()}.csv`;
      
      // Generate a temporary file path using the same approach as PDF
      const tempUri = await Print.printToFileAsync({
        html: `<pre>${this.escapeHtml(csvContent)}</pre>`,
        base64: false,
      });

      const originalDir = tempUri.uri.substring(0, tempUri.uri.lastIndexOf('/'));
      const filePath = `${originalDir}/${fileName}`;
      
      // Move and rename the file
      await FileSystem.moveAsync({
        from: tempUri.uri,
        to: filePath
      });

      // Save to gallery
      await this.saveToGallery(filePath);
      
      return fileName;
    } catch (error) {
      console.error('Excel Export Error:', error);
      throw new Error('Failed to generate Excel export');
    }
  }

  static getExcelTemplate(data: PDFReportData): string {
    return `Financial Data Export - ${data.mosqueName}
Period: ${data.reportPeriod}

SUMMARY
Total Donations,${formatCurrency(data.financialSummary.totalDonations)}
Total Expenses,${formatCurrency(data.financialSummary.totalExpenses)}
Net Balance,${formatCurrency(data.financialSummary.netBalance)}
Donation Count,${data.financialSummary.donationCount}
Expense Count,${data.financialSummary.expenseCount}

DONATION BREAKDOWN
Category,Amount,Percentage
${data.donationBreakdown.map(item => 
  `${item.category},${formatCurrency(item.amount)},${item.percentage}%`
).join('\n')}

EXPENSE BREAKDOWN
Category,Amount,Percentage
${data.expenseBreakdown.map(item => 
  `${item.category},${formatCurrency(item.amount)},${item.percentage}%`
).join('\n')}

MONTHLY DATA
Month,Donations,Expenses,Balance
${data.monthlyTrends.map(item => 
  `${item.month},${formatCurrency(item.donations)},${formatCurrency(item.expenses)},${formatCurrency(item.balance)}`
).join('\n')}`;
  }

  // Add the missing method that was causing the error
  static getReportTemplate(data: PDFReportData): string {
    return `Financial Report Preview
=======================

Mosque: ${data.mosqueName}
Period: ${data.reportPeriod}
Generated: ${data.generatedDate}

Summary:
• Total Donations: ${formatCurrency(data.financialSummary.totalDonations)}
• Total Expenses: ${formatCurrency(data.financialSummary.totalExpenses)}
• Net Balance: ${formatCurrency(data.financialSummary.netBalance)}

This report contains detailed financial breakdown and monthly trends.`;
  }

  static async checkGalleryPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  static async requestGalleryPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  // Additional method to share file directly
  static async shareFile(filePath: string): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share file error:', error);
      throw error;
    }
  }
}