# Local Proxy based Communication (LPC)

This article organizes in a single document the general concept and the technical details about a cross-app and others workspace wide interface based communication mechanism. We also look at each BindKraft feature that uses the mechanism to see how it fits into its goals and purposes.

The local proxy based communication is the core mechanism for semi-isolation **between apps**,between **apps and built-in API** and **between built-in API**. Although most programmers would not have a reason to write built-in API, the mechanism is one in the same in all cases. Thus knowing more about it gives a better perspective and understanding.

## When this semi-isolation is needed and why

It is mentioned in many places of the documentation that BindKraft does not attempt to be an OS, just OS-like and just for developer's convenience. This is a need that naturally arises from the wish to run multiple apps in the same WEB page (that we call `workspace`). Yes, this is a page in the browser. Yes, no matter what we do integrating all this together will leave some open doors that will negate any isolation efforts if they aim at the impossible (in this scenario). So, BindKraft just aims at helping the developers keep the isolation intact, but ultimately relies on their understanding that this is not a limitation, but a way to avoid mixing up everything into a hopelessly entangled mess.

Therefore the _local Proxy based Communication_ is one of these features that prevents mistakes, violations of app or API borders made when something needs to be done in a hurry and so on.

**When we need and what we need?** 

The first typical case would be When we want two separate apps to act as a server and a client. The server provides some services and the client consumes them. In more concrete form this will boil down to some interfaces known for both sides, but implemented by the server app, references to them (more precisely - their instances) obtained by the client app and then used - i.e. the client app calls methods on some of them, sometimes receives simpler results, but sometimes calling a method will return an instance of another such interface and so and so forth.

Wherever there is anything similar in other browser oriented frameworks and libraries this kind of interaction between server and a client (no matter if they resemble or not apps in BindKraft) is implemented by directly exchanging references to the objects of the server that implement the functionality needed by the client.

