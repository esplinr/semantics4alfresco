<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/action/action.lib.js">

/**
 * Auto tag docoument action
 * @method POST
 */

/**
 * Entrypoint required by action.lib.js
 *
 * @method runAction
 * @param p_params {object} Object literal containing files array
 * @return {object|null} object representation of action results
 */
function runAction(p_params)
{
   var results = [];
   var files = p_params.files;
   var file, fileNode, result, nodeRef;

   // Must have array of files
   if (!files || files.length == 0)
   {
      status.setCode(status.STATUS_BAD_REQUEST, "No files.");
      return;
   }

   for (file in files)
   {
      nodeRef = files[file];
      result =
      {
         nodeRef: nodeRef,
         action: "autotag",
         success: false
      }

      try
      {
         fileNode = search.findNode(nodeRef);
         if (fileNode === null)
         {
            result.id = file;
            result.nodeRef = nodeRef;
            result.success = false;
         }
         else
         {
			result.id = fileNode.name;
			result.type = fileNode.isContainer ? "folder" : "document";
			
			var action = actions.create("calaisAction");
			
			// since calaisKey is an empty string here, calaisKey needs to be configured in
			// webapps/alfresco/web-inf/classes/alfresco/module/calais/module-context.xml
			// on the calaisAction bean
			var calaisKey = "";		
			action.parameters["calaisKey"] = calaisKey;	
					
			action.parameters["autoTag"] = true;
			action.parameters["saveRDF"] = false;
			action.parameters["saveJSON"] = false;		
			      
			action.execute(fileNode);
			         
			result.success = true;
         }
      }
      catch (e)
      {
         result.id = file;
         result.nodeRef = nodeRef;
         result.success = false;
      }

      results.push(result);
   }

   return results;
}

/* Bootstrap action script */
main();
