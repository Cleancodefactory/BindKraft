# XML packet response

## Legacy 0.9 format

```
<packet>
	<status 
		issuccessful="0|1"
		?isreadonly="0|1"
		?isprobing="0|1"
	>
		<?message>(text)</message>
		<?returnurl>(text:<url>)</returnurl>
		<?title>(text)</title>
		<?messages>(JSON:Array<string>)</messages>
		<?operations>(JSON)</operations>
	</status>
	<?views>
		<viewnamex>(HTML)</viewnamex>*
	</views>
	<?rviews>
		<viewnamex>(HTML)</viewnamex>*
	</rviews>
	<?data>(JSON:<any>)</data>
	<?metadata>(JSON:<any>)</metadata>
	<?resources>(JSON:{
		(<resname>: {
			(<reskey>:<resval>)*
		})*
	})</resources>
	<?lookups>(JSON:{
		<resname>:{
			{<any>}*
		}*
	})
	</lookups>
	// Fully deprecated
	<rules></rules>
	<scripts></scripts>
</packet>	

```

## Deprecated before implementation 1.0 candidate

This section is for historical information only.

```
<packet xmlpackedresponese="1.0">
	<status 
		issuccessful="0|1"
		?isprobing="0|1"
	>
		<?message>(text)</message>
		<?returnurl>(text:<url>)</returnurl>
		<?title>(text)</title>
		<?messages>(JSON:Array<string>)</messages>
	</status>
	<?views>
		<:viewname: sid="<serverpath>">(CData: HTML)</:viewname:>*
	</views>
	<?data
		<data1>(JSON:<any>)</data1>
		<data2>(JSON:<any>)</data2>
	</data>
	<?metadata>(JSON:<any>)</metadata>
	<?resources>
		<resname sid="<serverpath>">(JSON:{
			(<reskey>:<string>)*
		})</resname>*
	</resources>
	<?lookups>
		<lookpuname>(JSON:[
			{<any>}*
		])</lookpuname>*
	</lookups>
</packet>	

```

## Valid version 1.0

```
<packet xmlpackedresponese="1.0">
	<status 
		issuccessful="0|1"
		?isprobing="0|1"
	>
		<?message>(text)</message>
		<?returnurl>(text:<url>)</returnurl>
		<?title>(text)</title>
		<?messages>(JSON:Array<string>)</messages>
	</status>
	<?views>
		<:viewname: sid="<serverpath>" cacheable="0|1">(CData: HTML)</:viewname:>*
	</views>
	<?data
		<data1>(JSON:<any>)</data1>
		<data2>(JSON:<any>)</data2>
	</data>
    <!-- Optional segment -->
	<?metadata>(JSON:<any>)</metadata>
	<?resources>
		<resname sid="<serverpath>">(JSON:{
			(<reskey>:<string>)*
		})</resname>*
	</resources>
	<?lookups>
		<lookpuname>(JSON:[
			{<any>}*
		])</lookpuname>*
	</lookups>
</packet>	

```

## Internal representation in javascript


```Javascript

{
	status {
		issuccessful: false|true,
		?isprobing: 0|1,
		?message: <string>,
		?title: <string>,
		// TODO: What to do with accumulative messages until we come with something wise?
		// ?messages: [<string>] // Deprecate!
		caching: {
			views: {
				viewname1: {
					sid: <view1_sid>,
					
				}
			}
		}
	},
	views: {
		<viename1>: <sring>,
		<viename2>: <sring>,
		<viename3>: <sring>,
	},
	attributes: {
		views: {
			<viewnameN>: {
				sid: viewN_sid
			}
		},
		datas: {
			dataN: {
				sid: dataN_sid
			}
		}

	},
	resources: {
		<resource1>: <json>,
		<resource2>: <json>,
		<resource3>: <json>,
	},
	data: <data1: json>,
	datas: {
		<data1>: <json>,
		<data2>: <json>,
		<data3>: <json>,
	},
		
}

```
