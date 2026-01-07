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
 * Convert points to half-points (used for font sizes in docx)
 * Font sizes in docx are specified in half-points (1 point = 2 half-points)
 */
function pointsToHalfPoints(points: number): number {
  return Math.round(points * 2);
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
  columnCount: number
): TableCell {
  const fontSize = theme.bodySize;
  const borderColor = theme.textColor.replace('#', '');
  const backgroundColor = theme.codeBackground.replace('#', '');

  return new TableCell({
    width: {
      size: Math.floor(100 / columnCount),
      type: WidthType.PERCENTAGE,
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
  columnCount: number
): TableCell {
  const fontSize = theme.bodySize;
  const borderColor = theme.textColor.replace('#', '');

  return new TableCell({
    width: {
      size: Math.floor(100 / columnCount),
      type: WidthType.PERCENTAGE,
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
  theme: ThemeData
): TableRow {
  const cells = headers.map((header) =>
    createHeaderCell(header, theme, headers.length)
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
  columnCount: number
): TableRow {
  // Ensure we have the right number of cells (pad with empty if needed)
  const normalizedCells = [...cells];
  while (normalizedCells.length < columnCount) {
    normalizedCells.push('');
  }

  const tableCells = normalizedCells.map((cell) =>
    createDataCell(cell, theme, columnCount)
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

  // Build table rows
  const tableRows: TableRow[] = [];

  // Add header row if headers exist
  if (headers.length > 0) {
    tableRows.push(createHeaderRow(headers, theme));
  }

  // Add data rows
  for (const row of rows) {
    tableRows.push(createDataRow(row, theme, columnCount));
  }

  // Handle empty table case
  if (tableRows.length === 0) {
    tableRows.push(createDataRow([''], theme, 1));
  }

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: tableRows,
  });
}
