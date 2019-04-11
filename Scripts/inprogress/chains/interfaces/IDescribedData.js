function IDescribedData() { }

IDescribedData.Interface("IDescribedData");
IDescribedData.DeclarationBlock({
    datadescriptionmodel: "rw string * name of the description model (method, vocabulary) used. ",
    contenttype: { type: "rw string * the content type or (internal/memory or null) if it is just data in memory", init: null },
    aspect: "rw any * An aspect describing what the data is."
});

/* Future extension of the mechanism may include data access interface(s)
    In this case certain factory is queried like this (only example)
    v = factory.QueryAceessInterface(describedData, InterfaceForAccess)
        - describedDAta will most likely be IDescribedDataHolder
        - InterfaceForAccess will be a name of an interface you want

        return resuly: null if unsuccessful
                        object supporting InterfaceForAccess

    1.The general assumption is that the requester knows how to work with data through one or more specific interfaces.
    2.A factory or factories can provide tools for accessing certain aspects of data through certain interfaces
    3.Any requester can this way help himself by finding the data piece he wants and extract access tool through a factory he knows about.
*/