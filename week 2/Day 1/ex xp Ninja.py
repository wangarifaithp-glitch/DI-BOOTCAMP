class Phone:
    """A class to represent a phone with calling and messaging capabilities."""
    
    def __init__(self, phone_number):
        """Initialize a Phone with a phone number, call history, and messages list."""
        self.phone_number = phone_number
        self.call_history = []
        self.messages = []
    
    def call(self, other_phone):
        """
        Simulate a call to another phone.
        Records the call in the call history and prints it.
        """
        call_message = f"{self.phone_number} called {other_phone.phone_number}"
        print(call_message)
        self.call_history.append(call_message)
    
    def show_call_history(self):
        """Print the call history of this phone."""
        print(f"\n--- Call History for {self.phone_number} ---")
        if not self.call_history:
            print("No calls in history.")
        else:
            for call in self.call_history:
                print(f"  • {call}")
        print()
    
    def send_message(self, other_phone, content):
        """
        Send a message to another phone.
        Saves the message in both phones' message lists.
        """
        message = {
            "to": other_phone.phone_number,
            "from": self.phone_number,
            "content": content
        }
        
        # Add to sender's messages
        self.messages.append(message)
        
        # Add to receiver's messages
        other_phone.messages.append(message)
        
        print(f"Message sent from {self.phone_number} to {other_phone.phone_number}: '{content}'")
    
    def show_outgoing_messages(self):
        """Show all outgoing messages sent from this phone."""
        print(f"\n--- Outgoing Messages from {self.phone_number} ---")
        outgoing = [msg for msg in self.messages if msg["from"] == self.phone_number]
        
        if not outgoing:
            print("No outgoing messages.")
        else:
            for msg in outgoing:
                print(f"  To: {msg['to']}")
                print(f"  Content: {msg['content']}")
                print()
    
    def show_incoming_messages(self):
        """Show all incoming messages received on this phone."""
        print(f"\n--- Incoming Messages to {self.phone_number} ---")
        incoming = [msg for msg in self.messages if msg["to"] == self.phone_number]
        
        if not incoming:
            print("No incoming messages.")
        else:
            for msg in incoming:
                print(f"  From: {msg['from']}")
                print(f"  Content: {msg['content']}")
                print()
    
    def show_messages_from(self, other_phone):
        """Show all messages from a specific phone number."""
        print(f"\n--- Messages from {other_phone.phone_number} to {self.phone_number} ---")
        messages_from = [msg for msg in self.messages 
                        if msg["from"] == other_phone.phone_number and msg["to"] == self.phone_number]
        
        if not messages_from:
            print(f"No messages from {other_phone.phone_number}.")
        else:
            for msg in messages_from:
                print(f"  Content: {msg['content']}")
        print()


# ==================== TEST CODE ====================

if __name__ == "__main__":
    # Create phone objects
    phone1 = Phone("123-456-7890")
    phone2 = Phone("098-765-4321")
    phone3 = Phone("555-555-5555")
    
    print("="*60)
    print("EXERCISE 1: CALL HISTORY - Phone Class Test")
    print("="*60)
    
    # Test calling functionality
    print("\n--- Testing Call Functionality ---")
    phone1.call(phone2)
    phone1.call(phone3)
    phone2.call(phone1)
    phone3.call(phone1)
    phone2.call(phone3)
    
    # Show call history
    phone1.show_call_history()
    phone2.show_call_history()
    phone3.show_call_history()
    
    # Test messaging functionality
    print("\n--- Testing Messaging Functionality ---")
    phone1.send_message(phone2, "Hey! How are you?")
    phone2.send_message(phone1, "I'm good! How about you?")
    phone1.send_message(phone2, "Great! Let's catch up soon.")
    phone1.send_message(phone3, "Hi there!")
    phone3.send_message(phone1, "Hello! What's up?")
    
    # Show outgoing messages
    print("\n--- Outgoing Messages ---")
    phone1.show_outgoing_messages()
    phone2.show_outgoing_messages()
    phone3.show_outgoing_messages()
    
    # Show incoming messages
    print("\n--- Incoming Messages ---")
    phone1.show_incoming_messages()
    phone2.show_incoming_messages()
    phone3.show_incoming_messages()
    
    # Show messages from specific phone
    print("\n--- Messages from Specific Phone ---")
    phone1.show_messages_from(phone2)
    phone2.show_messages_from(phone1)
    phone1.show_messages_from(phone3)
