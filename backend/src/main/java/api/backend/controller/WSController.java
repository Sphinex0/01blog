package api.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import api.backend.model.ws.RequestMessage;
import api.backend.model.ws.ResponseMessage;

@Controller
public class WSController {

    // Simple DTO for messages
    // (You would need to create these RequestMessage and ResponseMessage classes)
    
    /**
     * Handles messages sent to "/app/hello"
     * The return value is broadcast to everyone subscribed to "/topic/greetings"
     */
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public ResponseMessage greeting(RequestMessage message) throws Exception {
        // Simulate a delay
        Thread.sleep(1000); 
        String responseText = "Hello, " + message.getName() + "!";
        return new ResponseMessage(responseText);
    }
}

