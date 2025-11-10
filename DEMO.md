# Demo Guide & Example Output

## Visual Overview

The application consists of three main sections:

```
┌─────────────────────────────────────────────────────────────┐
│  DocSearch AI        [123 chunks indexed]  [Clear All]      │
├─────────────────────────────────────────┬───────────────────┤
│                                         │                   │
│  Main Area (Chat/Upload)                │  Sources Panel    │
│                                         │                   │
│  - Upload zone (initially)              │  - Document refs  │
│  - Chat interface (after upload)        │  - Page numbers   │
│  - Message history                      │  - Relevance %    │
│  - Input box                            │  - Snippets       │
│                                         │                   │
└─────────────────────────────────────────┴───────────────────┘
```

## Step-by-Step Walkthrough

### Step 1: Initial State

When you first open the app at `http://localhost:5173`:

- Clean header with "DocSearch AI" title
- Large upload zone in center with drag-and-drop icon
- Empty sources panel on right
- Text: "Drop PDF files here or click to browse"

### Step 2: Upload Documents

Drag a PDF file (or multiple) into the upload zone:

1. **During Upload**:
   - Spinning loader appears
   - Text changes to "Processing documents..."
   - Upload zone pulses with blue gradient

2. **After Upload**:
   - Green success message: "Successfully uploaded 2 documents"
   - Header shows: "123 chunks indexed"
   - Upload zone replaced with chat interface
   - "Clear All" button appears in header

### Step 3: Ask Questions

Type a question and press Send:

**Example Question**: "What are the main conclusions of the research?"

1. **Your message appears**:
   - Blue gradient bubble on the right
   - User icon
   - Timestamp

2. **AI thinks**:
   - Spinner with "Thinking..." below chat

3. **AI responds**:
   - Gray bubble on the left
   - Bot icon
   - Timestamp

### Step 4: View Sources

Right panel automatically populates with source cards:

```
┌─────────────────────────────────────┐
│ Sources                     6 found │
├─────────────────────────────────────┤
│ 📄 research_paper.pdf       [87%]   │
│    Page 12                          │
│    "The results demonstrated a      │
│    45% increase in performance..."  │
├─────────────────────────────────────┤
│ 📄 research_paper.pdf       [82%]   │
│    Page 15                          │
│    "Correlation analysis revealed..." │
├─────────────────────────────────────┤
│ 📄 methodology.pdf          [79%]   │
│    Page 8                           │
│    "Our approach was validated..."  │
└─────────────────────────────────────┘
```

## Example Interactions

### Example 1: Research Paper

**Document**: A 20-page academic paper on machine learning

**Q**: "What dataset was used in this study?"

**A**: "The study used the ImageNet dataset, which contains 1.2 million images across 1000 categories. The researchers also created a custom subset focusing on medical images."

**Sources**:
- research_paper.pdf, Page 5 (91% relevance)
  - "We utilized the ImageNet dataset containing 1.2 million labeled images across 1000 object categories..."
- research_paper.pdf, Page 6 (85% relevance)
  - "Additionally, a custom medical imaging subset was curated for domain-specific evaluation..."

---

**Q**: "What were the accuracy results?"

**A**: "The model achieved 94.3% accuracy on the test set, with 96.1% on medical images and 93.8% on general ImageNet categories."

**Sources**:
- research_paper.pdf, Page 14 (93% relevance)
  - "Final results showed 94.3% overall accuracy (Table 3), with medical imaging subset achieving 96.1%..."

### Example 2: Technical Manual

**Document**: A product manual

**Q**: "How do I reset the device?"

**A**: "To reset the device: 1) Press and hold the power button for 10 seconds, 2) Release when the LED flashes red, 3) Wait 30 seconds for reboot."

**Sources**:
- manual.pdf, Page 42 (95% relevance)
  - "Device Reset Procedure: Press and hold the power button for 10 seconds. Release when LED indicator flashes red..."

### Example 3: Multiple Documents

**Documents**: contract.pdf, terms.pdf, policy.pdf

**Q**: "What is the refund policy?"

**A**: "Based on the available documents, refunds are available within 30 days of purchase for unused items with receipt. Processing takes 5-7 business days."

**Sources**:
- policy.pdf, Page 3 (89% relevance)
  - "Refund Policy: Customers may return unused items within 30 days of purchase with valid receipt..."
- terms.pdf, Page 8 (84% relevance)
  - "Refund processing time: 5-7 business days from approval..."

## Features Demonstrated

### 1. Accurate Source Attribution
Every fact is traced to specific page numbers

### 2. Multi-Document Synthesis
Combines information from multiple PDFs

### 3. Relevance Scoring
Shows confidence/similarity percentage

### 4. Context Preservation
Understands document structure and relationships

### 5. Graceful Degradation
When answer not found: "I don't know based on the available documents."

## Performance Metrics

| Metric | First Query | Subsequent |
|--------|-------------|------------|
| Upload (1MB PDF) | ~2 seconds | N/A |
| Processing | ~5 seconds | N/A |
| Query Response | 15-20s | 2-5s |
| UI Responsiveness | Instant | Instant |

## Visual Design Highlights

### Color Palette
- Primary: Blue gradient (#3B82F6 → #2563EB)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Neutral: Gray scale (#F9FAFB → #1F2937)

### Interactions
- Hover effects on all buttons
- Smooth transitions (200ms)
- Pulsing indicators for loading
- Fade-in animations for messages
- Scale effects on upload zone

### Typography
- Headers: Bold, 24px
- Body: Regular, 14px
- Captions: 12px, muted

### Spacing
- Consistent 8px grid
- Generous padding (16-24px)
- Clear visual hierarchy

## Error States

### No Documents Uploaded
**Q**: "What is the capital of France?"
**Response**: Error message - "No documents uploaded yet. Please upload PDFs first."

### Empty Query
Attempting to send empty message → Send button disabled

### Invalid File Type
Uploading .txt file → Red error: "Please upload PDF files only"

### Backend Offline
Upload attempt → Red error: "Upload failed - Unable to connect to server"

## Clear All Functionality

Clicking "Clear All":
1. Confirmation dialog appears
2. If confirmed:
   - All messages cleared
   - Sources panel emptied
   - Upload zone reappears
   - Header shows 0 chunks
   - Backend deletes all files and embeddings

## Mobile Responsive

On smaller screens:
- Sources panel moves below chat
- Upload zone scales down
- Messages stack properly
- Touch-friendly button sizes
- Scrollable content areas

## Browser Compatibility

Tested and working:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

## Tips for Best Results

1. **Upload Quality PDFs**: Text-based, not scanned images
2. **Be Specific**: "What is X?" better than "Tell me everything"
3. **Check Sources**: Verify information against original pages
4. **Clear When Done**: Free up memory between sessions
5. **Wait for First Query**: Initial model loading takes time

## Known Limitations

1. **OCR**: Scanned PDFs without text layer won't work
2. **Images**: Cannot read charts, graphs, or images
3. **Tables**: Complex tables may be poorly formatted
4. **Languages**: Best with English, limited multilingual support
5. **Context Window**: Very long documents may exceed limits

## Future Enhancements Preview

Coming soon:
- 🔄 Conversation history across sessions
- 📊 Support for Excel, Word documents
- 🖼️ Image/table understanding
- 💬 Follow-up questions with context
- 📥 Export conversations as PDF
- 👥 Multi-user workspaces
