import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

public class SmsSender {
    // Twilio credentials (replace with your credentials)
    public static final String ACCOUNT_SID = "AC5929d4e3dc7d4ec515b65f1d47aa52a1"; // Replace with your Twilio Account SID
    public static final String AUTH_TOKEN = "2d99729b65c3c94b13219419b499f2fa"; // Replace with your Twilio Auth Token

    public static void main(String[] args) {
        // Initialize Twilio SDK
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        // Send SMS
        Message message = Message.creator(
                new PhoneNumber("recipient_phone_number"),  // To phone number (e.g., "+1234567890")
                new PhoneNumber("your_twilio_phone_number"),  // From Twilio phone number (e.g., "+1987654321")
                "Here is your bill receipt: [link to PDF or plain message]")
            .create();

        System.out.println("SMS sent with SID: " + message.getSid());
    }
}
