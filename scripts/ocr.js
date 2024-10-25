import Tesseract from 'tesseract.js';

// Define a new function name to avoid recursion

// This dosent work as expected, but just leaving it here for maybe future - martin
export async function performOCRTask(imageUrl) {
    if (!imageUrl) {
        console.error('No image URL provided');
        return;
    }

    try {
        const result = await Tesseract.recognize(imageUrl, 'eng', {
            logger: (m) => console.log(m), // Optional: to see progress logs
        });
        console.log('OCR Text:', result.data.text);
    } catch (error) {
        console.error('Error performing OCR:', error);
    }
}

// Call the new function
performOCRTask(imageUrl);
