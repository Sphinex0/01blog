package api.backend.model.ws;

public class ResponseMessage {
   private String content;
   // constructor, getters, setters...
public ResponseMessage() {
}

public ResponseMessage(String content) {
    this.content = content;
}

public String getContent() {
    return content;
}

public void setContent(String content) {
    this.content = content;
}

@Override
public String toString() {
    return "ResponseMessage{content='" + content + "'}";
}
}
