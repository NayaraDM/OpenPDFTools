function downloadPDF(bytes, filename){

    const blob = new Blob(
        [bytes],
        { type: "application/pdf" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);
}

async function mergePDFs(){

    const files =
    document.getElementById("mergeFiles").files;

    const status =
    document.getElementById("mergeStatus");

    if(files.length < 2){

        alert("Selecione pelo menos 2 PDFs.");
        return;
    }

    status.innerHTML =
    "Processando PDFs...";

    const mergedPdf =
    await PDFLib.PDFDocument.create();

    for(const file of files){

        const bytes =
        await file.arrayBuffer();

        const pdf =
        await PDFLib.PDFDocument.load(bytes);

        const pages =
        await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
        );

        pages.forEach(page =>
            mergedPdf.addPage(page)
        );
    }

    const output =
    await mergedPdf.save();

    downloadPDF(
        output,
        "pdf_unificado.pdf"
    );

    status.innerHTML =
    "✅ PDF criado com sucesso.";
}

async function extractPages(){

    const file =
    document.getElementById("extractFile").files[0];

    const pagesText =
    document.getElementById("pages").value;

    const status =
    document.getElementById("extractStatus");

    if(!file){

        alert("Selecione um PDF.");
        return;
    }

    if(!pagesText){

        alert("Informe as páginas.");
        return;
    }

    status.innerHTML =
    "Extraindo páginas...";

    const bytes =
    await file.arrayBuffer();

    const pdf =
    await PDFLib.PDFDocument.load(bytes);

    const newPdf =
    await PDFLib.PDFDocument.create();

    const pages =
    pagesText.split(",");

    for(const p of pages){

        const index =
        parseInt(p.trim()) - 1;

        if(
            index >= 0 &&
            index < pdf.getPageCount()
        ){

            const [copied] =
            await newPdf.copyPages(
                pdf,
                [index]
            );

            newPdf.addPage(copied);
        }
    }

    const output =
    await newPdf.save();

    downloadPDF(
        output,
        "paginas_extraidas.pdf"
    );

    status.innerHTML =
    "✅ Extração concluída.";
}
