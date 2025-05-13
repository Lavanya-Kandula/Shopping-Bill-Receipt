import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class BillGenerator {

    public static void generateBill(String customerName, String mobileNumber, double totalAmount) {
        Document document = new Document();

        try {
            String fileName = "Bill_" + customerName.replaceAll(" ", "_") + ".pdf";
            PdfWriter.getInstance(document, new FileOutputStream(fileName));

            document.open();

            document.add(new Paragraph("🛍 Shopping Mall Bill Receipt 🧾"));
            document.add(new Paragraph("----------------------------------"));
            document.add(new Paragraph("Customer Name: " + customerName));
            document.add(new Paragraph("Mobile Number: " + mobileNumber));
            document.add(new Paragraph("Total Amount: ₹" + totalAmount));
            document.add(new Paragraph("Thank you for shopping with us!"));

            System.out.println("✅ Bill generated: " + fileName);
        } catch (FileNotFoundException | DocumentException e) {
            System.out.println("❌ Error: " + e.getMessage());
        } finally {
            document.close();
        }
    }
}
