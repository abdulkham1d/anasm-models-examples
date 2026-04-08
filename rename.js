import fs from 'fs';
import path from 'path';

// Fayl joylashgan papka
const folderPath = './public/model/bones';  // Corrected path

// Papkaga kirish
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Faqat .obj fayllarni tanlash
  const objFiles = files.filter(file => file.endsWith('.stl'));

  // Fayllarni yangi nom bilan almashtirish
  objFiles.forEach((file, index) => {
    const oldFile = path.join(folderPath, file);
    const newFile = path.join(folderPath, `part${index + 1}.stl`);

    // Faylni nomini o'zgartirish
    fs.rename(oldFile, newFile, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        return;
      }
      console.log(`Renamed ${file} to part${index + 1}.obj`);
    });
  });
});
