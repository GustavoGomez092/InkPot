/**
 * Table Element Converter for DOCX
 * Converts markdown table elements to Word document tables
 */

import {
  BorderStyle,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type { MarkdownElement } from '../../pdf/markdown-parser.js';

/**
 * Convert points to DXA units (20 DXA = 1 point)
 */
function pointsToDxa(points: number): number {
  return Math.round(points * 20);
}

/**
 * Convert inches to DXA (twips) - 1 inch = 1440 DXA
 */
function inchesToDxa(inches: number): number {
  return Math.round(inches * 1440);
}

/**
 * Convert points to half-points (used for font sizes in docx)
 * Font sizes in docx are specified in half-points (1 point = 2 half-points)
 */
function pointsToHalfPoints(points: number): number {
  return Math.round(points * 2);
}

/**
 * Calculate the content width in DXA based on theme page settings
 * Content width = page width - left margin - right margin
 */
function calculateContentWidth(theme: ThemeData): number {
  const pageWidthInches = theme.pageWidth || 8.5; // Default US Letter
  const marginLeftInches = theme.marginLeft || 1;
  const marginRightInches = theme.marginRight || 1;
  const contentWidthInches = pageWidthInches - marginLeftInches - marginRightInches;
  return inchesToDxa(contentWidthInches);
}

/**
 * Create standard table cell borders
 */
function createCellBorders(color: string) {
  return {
    top: { style: BorderStyle.SINGLE, size: 8, color },
    bottom: { style: BorderStyle.SINGLE, size: 8, color },
    left: { style: BorderStyle.SINGLE, size: 8, color },
    right: { style: BorderStyle.SINGLE, size: 8, color },
  };
}

/**
 * Create a header cell with bold text and background shading
 */
function createHeaderCell(
  content: string,
  theme: ThemeData,
  cellWidthDxa: number
): TableCell {
  const fontSize = theme.bodySize;
  const borderColor = theme.textColor.replace('#', '');
  const backgroundColor = theme.codeBackground.replace('#', '');

  return new TableCell({
    width: {
      size: cellWidthDxa,
      type: WidthType.DXA,
    },
    shading: {
      type: ShadingType.SOLID,
      color: backgroundColor,
      fill: backgroundColor,
    },
    borders: createCellBorders(borderColor),
    margins: {
      top: pointsToDxa(6 * 0.75),
      bottom: pointsToDxa(6 * 0.75),
      left: pointsToDxa(6 * 0.75),
      right: pointsToDxa(6 * 0.75),
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
            bold: true,
          }),
        ],
      }),
    ],
  });
}

/**
 * Create a data cell with regular text
 */
function createDataCell(
  content: string,
  theme: ThemeData,
  cellWidthDxa: number
): TableCell {
  const fontSize = theme.bodySize;
  const borderColor = theme.textColor.replace('#', '');

  return new TableCell({
    width: {
      size: cellWidthDxa,
      type: WidthType.DXA,
    },
    borders: createCellBorders(borderColor),
    margins: {
      top: pointsToDxa(6 * 0.75),
      bottom: pointsToDxa(6 * 0.75),
      left: pointsToDxa(6 * 0.75),
      right: pointsToDxa(6 * 0.75),
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
          }),
        ],
      }),
    ],
  });
}

/**
 * Create a header row from headers array
 */
function createHeaderRow(
  headers: string[],
  theme: ThemeData,
  cellWidthDxa: number
): TableRow {
  const cells = headers.map((header) =>
    createHeaderCell(header, theme, cellWidthDxa)
  );

  return new TableRow({
    tableHeader: true,
    children: cells,
  });
}

/**
 * Create a data row from cell values array
 */
function createDataRow(
  cells: string[],
  theme: ThemeData,
  columnCount: number,
  cellWidthDxa: number
): TableRow {
  // Ensure we have the right number of cells (pad with empty if needed)
  const normalizedCells = [...cells];
  while (normalizedCells.length < columnCount) {
    normalizedCells.push('');
  }

  const tableCells = normalizedCells.map((cell) =>
    createDataCell(cell, theme, cellWidthDxa)
  );

  return new TableRow({
    children: tableCells,
  });
}

/**
 * Convert a table markdown element to a docx Table
 */
export function createTableElement(
  element: MarkdownElement,
  theme: ThemeData
): Table {
  const headers = element.headers || [];
  const rows = element.rows || [];

  // Determine column count from headers or first row
  const columnCount = headers.length > 0
    ? headers.length
    : rows.length > 0 && rows[0]
      ? rows[0].length
      : 1;

  // Calculate table width and column widths in DXA units
  // Using DXA instead of PERCENTAGE for better cross-platform compatibility
  // (WidthType.PERCENTAGE doesn't work reliably in Google Docs, Apple Pages, etc.)
  const tableWidthDxa = calculateContentWidth(theme);
  const cellWidthDxa = Math.floor(tableWidthDxa / columnCount);

  // Create columnWidths array for the table (all columns equal width)
  const columnWidths = Array(columnCount).fill(cellWidthDxa);

  // Build table rows
  const tableRows: TableRow[] = [];

  // Add header row if headers exist
  if (headers.length > 0) {
    tableRows.push(createHeaderRow(headers, theme, cellWidthDxa));
  }

  // Add data rows
  for (const row of rows) {
    tableRows.push(createDataRow(row, theme, columnCount, cellWidthDxa));
  }

  // Handle empty table case
  if (tableRows.length === 0) {
    tableRows.push(createDataRow([''], theme, 1, tableWidthDxa));
  }

  return new Table({
    width: {
      size: tableWidthDxa,
      type: WidthType.DXA,
    },
    columnWidths: columnWidths,
    rows: tableRows,
  });
}
