function wrapText(text: string, maxWidth: number): string[] {
    if (text.length <= maxWidth) {
        return [text];
    }

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        // If a single word is longer than maxWidth, split it
        if (word.length > maxWidth) {
            if (currentLine) {
                lines.push(currentLine);
                currentLine = '';
            }
            for (let i = 0; i < word.length; i += maxWidth) {
                lines.push(word.slice(i, i + maxWidth));
            }
        } else if (currentLine.length + (currentLine ? 1 : 0) + word.length <= maxWidth) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function createPaddedBoxMessageFunc(
    message: string,
    padding: number = 4,
    maxWidth: number = 60
): string {
    // Split message by newlines first
    const rawLines = message.split('\n');

    // Wrap each line if it exceeds maxWidth
    const wrappedLines: string[] = [];
    for (const line of rawLines) {
        if (line.length > maxWidth) {
            wrappedLines.push(...wrapText(line, maxWidth));
        } else {
            wrappedLines.push(line);
        }
    }

    // Find the longest line to determine box width
    const longestLineLength = Math.max(...wrappedLines.map(line => line.length));
    const contentWidth = Math.min(longestLineLength, maxWidth);
    const boxWidth = contentWidth + padding * 2 + 2; // +2 for the border characters

    const topBorder = "┌" + "─".repeat(boxWidth - 2) + "┐";
    const bottomBorder = "└" + "─".repeat(boxWidth - 2) + "┘";

    // Create padded lines
    const paddedLines = wrappedLines.map(line => {
        const rightPadding = contentWidth - line.length + padding;
        return "│" + " ".repeat(padding) + line + " ".repeat(rightPadding) + "│";
    });

    return `
${topBorder}
${paddedLines.join('\n')}
${bottomBorder}
`;
}

export { createPaddedBoxMessageFunc };