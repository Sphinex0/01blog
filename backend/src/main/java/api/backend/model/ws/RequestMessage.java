package api.backend.model.ws;

public class RequestMessage {
   private String name;
   // getters and setters...
public RequestMessage() {}

public RequestMessage(String name) {
    this.name = name;
}

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}

@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof RequestMessage)) return false;
    RequestMessage that = (RequestMessage) o;
    return java.util.Objects.equals(name, that.name);
}

@Override
public int hashCode() {
    return java.util.Objects.hash(name);
}

@Override
public String toString() {
    return "RequestMessage{name='" + name + "'}";
}
}
