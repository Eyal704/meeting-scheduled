'use strict';
// Render each A4 page separately: bounded memory, Hebrew layout and intact photos.
async function createMassadPDF(markup, filename) {
  await document.fonts.ready;
  const stage = document.createElement('div');
  stage.className = 'pdf-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = markup;
  document.body.append(stage);
  const source = stage.firstElementChild;
  source.classList.add('pdf-source');
  const pages = [];
  try {
    await Promise.all([...source.querySelectorAll('img')].map(img => img.decode()));
    const header = source.querySelector('.paper-top');
    function newPage() {
      const page = document.createElement('article');
      page.className = 'report-paper pdf-page';
      page.dir = 'rtl';
      page.append(header.cloneNode(true));
      const body = document.createElement('div');
      body.className = 'pdf-body';
      page.append(body);
      const footer = document.createElement('div');
      footer.className = 'pdf-footer';
      page.append(footer);
      stage.append(page);
      pages.push(page);
      return body;
    }
    let body = newPage();
    const overflow = () => body.scrollHeight > body.clientHeight + 1;
    function add(node) {
      body.append(node);
      if (!overflow()) return;
      const oversized = node.getBoundingClientRect().height > body.clientHeight;
      node.remove();
      if (!oversized && body.children.length) {
        body = newPage();
        body.append(node);
        if (!overflow()) return;
        node.remove();
      }
      if (node.children.length) {
        for (const child of [...node.children]) add(child.cloneNode(true));
        return;
      }
      // Very long free text can span pages without dropping or clipping words.
      let text = node.textContent;
      while (text) {
        const part = node.cloneNode(false);
        body.append(part);
        let lo = 0, hi = text.length;
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          part.textContent = text.slice(0, mid);
          if (overflow()) hi = mid - 1; else lo = mid;
        }
        if (!lo) {
          part.remove();
          if (body.children.length) { body = newPage(); continue; }
          throw new Error('לא ניתן להתאים את אחד הפריטים לעמוד. אפשר להשתמש בהדפסה.');
        }
        let end = lo;
        if (lo < text.length) {
          const space = text.lastIndexOf(' ', lo);
          if (space > lo * .8) end = space + 1;
        }
        part.textContent = text.slice(0, end);
        text = text.slice(end);
        if (text) body = newPage();
      }
    }
    const blocks = [...source.children].filter(el => el !== header);
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].cloneNode(true);
      // Keep section headings with the start of the following block.
      if (block.tagName === 'H3' && blocks[i + 1] && body.children.length) {
        const probe = blocks[i + 1].cloneNode(true);
        body.append(block, probe);
        const tooTall = overflow() && probe.getBoundingClientRect().height < body.clientHeight - 70;
        block.remove(); probe.remove();
        if (tooTall) body = newPage();
      }
      add(block);
    }
    source.remove();
    const pdf = new jspdf.jsPDF({unit: 'mm', format: 'a4', compress: true});
    pdf.setProperties({title: filename, creator: 'Massad field reports'});
    for (let i = 0; i < pages.length; i++) {
      pages[i].querySelector('.pdf-footer').textContent = `מסד · גרסה לבדיקת הלקוח · עמוד ${i + 1} מתוך ${pages.length}`;
      const picture = await htmlToImage.toJpeg(pages[i], {quality: .92, pixelRatio: 1.6, backgroundColor: '#ffffff', fontEmbedCSS: ''});
      if (i) pdf.addPage();
      pdf.addImage(picture, 'JPEG', 0, 0, 210, 297);
    }
    return new File([pdf.output('blob')], filename, {type: 'application/pdf'});
  } finally {
    stage.remove();
  }
}
