package bspackage;

import java.sql.*;

import javax.naming.*;
import javax.sql.*;
import org.json.*;
import com.sun.rowset.CachedRowSetImpl;

public class DbProcManager {
	
	private static String m_dbName;
	private static JSONObject obj;
	private static JSONArray jarray;
	private static JSONArray jarray2;
	

	public static Connection getConnection_ms() {
		try {
			Connection conn = null;
            Context ctx = new InitialContext() ;
            DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/" + m_dbName) ;
            conn = ds.getConnection();
            //System.out.println("Message: DataBase "+m_dbName);
			return conn;
		} catch (Exception ex) {
			System.err.println("Error: Unable to get a connection: "+m_dbName);
            System.out.println(ex.getMessage());
		}
		return null;
	}

    public static Connection getConnection_ms_del() {
        try {
            Connection conn = null;
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");// SqlDriver
            conn = DriverManager.getConnection(
                    "jdbc:sqlserver://localhost:1433;DatabaseName="+m_dbName,//192.168.199.122;baolong456.gicp.net;192.168.9.119;192.168.3.122
                    "007",
                    "");
            return conn;
        } catch (Exception ex) {
            System.err.println("Error: Unable to get a connection: " + ex);
            ex.printStackTrace();
        }
        return null;
    }

	public DbProcManager(String dbName){
		m_dbName = dbName;
		obj = new JSONObject();
		jarray = new JSONArray();
		jarray2 = new JSONArray();
	}
	
	public JSONObject getObject(){
		return DbProcManager.obj;
	}
	
	public JSONArray getArray(){
		return DbProcManager.jarray;
	}
	
	public JSONArray getArray2(){
		return DbProcManager.jarray2;
	}
	
	public JSONObject DbProcessToJson( String sql ,String paramStr ,String rootName ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	int numberOfColumns = 0;
        JSONArray jArray = new JSONArray();
        JSONObject jObject = new JSONObject();
    	try{
    	    conn = DbProcManager.getConnection_ms();
    	    PreparedStatement pst=conn.prepareStatement(sql);
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();
    	    int count = 0;
    	    while ( resultSet != null && resultSet.next() ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = resultSet.getObject(i)==null?"":resultSet.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
                ++count;
    	    }
    	    jObject.put(rootName, jArray).put("totalCount",Integer.toString(count));
    	    return jObject;
    	}catch(Exception ex){
			System.err.println("Error: Unable to get a connection: " + ex);
			ex.printStackTrace(); 
			return null;
    	}
	}

	public JSONObject sysDocumentToJson( String category ,String kind ,String sysid ){
    	Connection conn = null;
    	ResultSet resultSet = null;
        PreparedStatement proc =null;
    	int numberOfColumns;
        JSONObject jObject = new JSONObject();
    	try{
    	    conn = DbProcManager.getConnection_ms();
    	    proc = conn.prepareStatement("exec get_sysdoc ?,?,?");
            proc.setString(1, category);
            proc.setString(2, kind);
            proc.setString(3, sysid);
            if(proc.execute()){
                do{
               		resultSet = proc.getResultSet();
            	    ResultSetMetaData metaData = resultSet.getMetaData();
            	    numberOfColumns = metaData.getColumnCount();
            	    String rootname="";
            	    int count = 0;
                    JSONArray jArray = new JSONArray();
            	    while ( resultSet != null && resultSet.next() ) {
            	    	JSONObject jObj = new JSONObject();
                        for (int i = 1; i <= numberOfColumns; ++i) {
                            String columnName = metaData.getColumnLabel(i);
                            Object value = resultSet.getObject(i)==null?"":resultSet.getObject(i);
                            if(columnName.equals("rootname")){
                            	rootname = value.toString();
                            }else{
                            	jObj.put(columnName, value.toString());
                            }
                        }
                        jArray.put(jObj);
                        ++count;
            	    }
            	    jObject.put(rootname, jArray).put("totalCount",Integer.toString(count));
            	    resultSet.close();
                }while( proc.getMoreResults() );
                proc.close();
                String defaultRecordSql = "";
                //System.out.println(jObject.toString());
                if(!jObject.isNull("sys_document_order_detail")){
                    JSONArray jarray = jObject.getJSONArray("sys_document_order_detail");
                    //System.out.println("check sys_document_order_detail String : "+jarray.toString());
                    for(int i = 0 ; i<jarray.length();++i){
                        String tmpString;
                        if( jarray.getJSONObject(i).getString("datatype").equals("int") ){
                            tmpString = jarray.getJSONObject(i).getString("default_value").isEmpty() ? "0" : jarray.getJSONObject(i).getString("default_value");
                            defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("subtype") + "_" + jarray.getJSONObject(i).getString("field_rawname");
                        }
                        if( jarray.getJSONObject(i).getString("datatype").equals("float") ){
                            tmpString = jarray.getJSONObject(i).getString("default_value").isEmpty() ? "0" : jarray.getJSONObject(i).getString("default_value");
                            defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("subtype") + "_" + jarray.getJSONObject(i).getString("field_rawname");
                        }
                        if( jarray.getJSONObject(i).getString("datatype").equals("bool") ){
                            tmpString = jarray.getJSONObject(i).getString("default_value").isEmpty() ? "0" : jarray.getJSONObject(i).getString("default_value");
                            defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("subtype") + "_" + jarray.getJSONObject(i).getString("field_rawname");
                        }
                        if( jarray.getJSONObject(i).getString("datatype").equals("string") ){
                            tmpString = jarray.getJSONObject(i).getString("default_value").isEmpty() ? "''" : jarray.getJSONObject(i).getString("default_value");
                            defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("subtype") + "_" + jarray.getJSONObject(i).getString("field_rawname");
                        }
                        if( (i+1)<jarray.length() ){
                            defaultRecordSql = defaultRecordSql + " ,";
                        }
                    }
                    JSONArray formJArray = new JSONArray();
                    JSONArray gridJArray = new JSONArray();
                    try{
                        proc = conn.prepareStatement("select " + defaultRecordSql);
                        resultSet = proc.executeQuery();
                        ResultSetMetaData metaData = resultSet.getMetaData();
                        numberOfColumns = metaData.getColumnCount();
                        if(resultSet != null && resultSet.next()){
                            JSONObject jobj;
                            for (int i = 1; i <= numberOfColumns; i++) {
                                jobj = new JSONObject();
                                String columnName = metaData.getColumnLabel(i);
                                String columnTT = columnName.substring(0,5);
                                columnName = columnName.substring(5);
                                String columnType = getCorrespondType(metaData.getColumnTypeName(i));
                                Object value = resultSet.getObject(i);
                                jobj.put("name",columnName);
                                if(columnType.equals("int")){
                                    jobj.put( "defaultValue" ,Integer.valueOf(value.toString()) );
                                }else{
                                    if(columnType.equals("float")){
                                        jobj.put( "defaultValue" ,Float.valueOf(value.toString()) );
                                    }else{
                                        jobj.put( "defaultValue" ,value.toString() );
                                    }
                                }
                                jobj.put("type" ,columnType);
                                if(columnTT.contains("grid")){
                                    gridJArray.put(jobj);
                                }
                                if(columnTT.contains("form")){
                                    formJArray.put(jobj);
                                }
                            }
                        }
                    }catch(Exception ex){
                        System.out.println(ex.getMessage());
                        System.out.println("select " + defaultRecordSql);
                    }finally{
                        if(formJArray != null){
                            jObject.put("defaultRecordF", formJArray);
                        }
                        if(gridJArray != null){
                            jObject.put("defaultRecordG", gridJArray);
                        }
                    }
                    resultSet.close();
                }
            }
    	    return jObject;
    	}catch(Exception ex){
			System.out.println(ex.getMessage());
			return null;
    	}finally{
            try {
                proc.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            try {
                conn.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
	}

	public JSONObject sysDocumentDetailToJson( String category ,String kind ,String sysid ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	int numberOfColumns = 0;
        JSONObject jObject = new JSONObject();
    	try{
    	    conn = DbProcManager.getConnection_ms();
    	    CallableStatement proc = conn.prepareCall("{ call get_sysdocdetail(?,?,?) }");
            proc.setString(1, category);
            proc.setString(2, kind);
            proc.setString(3, sysid);
            if(proc.execute()){
                do{
               		resultSet = proc.getResultSet();
            	    ResultSetMetaData metaData = resultSet.getMetaData();
            	    numberOfColumns = metaData.getColumnCount();
            	    String rootname="";
            	    int count = 0;
                    JSONArray jArray = new JSONArray();
            	    while ( resultSet != null && resultSet.next() ) {
            	    	JSONObject jObj = new JSONObject();
                        for (int i = 1; i <= numberOfColumns; ++i) {
                            String columnName = metaData.getColumnLabel(i);
                            Object value = resultSet.getObject(i)==null?"":resultSet.getObject(i);
                            if(columnName.equals("rootname")){
                            	rootname = value.toString();
                            }else{
                            	jObj.put(columnName, value.toString());
                            }
                        }
                        jArray.put(jObj);
                        ++count;
            	    }
            	    jObject.put(rootname, jArray).put("totalCount",Integer.toString(count));
            	    resultSet.close();
                }while( proc.getMoreResults() );
            }
    	    return jObject;
    	}catch(Exception ex){
			System.err.println("Error: Unable to get a connection: " + ex);
			ex.printStackTrace(); 
			return null;
    	}
	}

	public String DbProcessToJsonp( String sql ,String paramStr ,String rootName ,int start ,int limit ,String callbackStr ,String defaultRec ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	PreparedStatement pst = null;
    	int numberOfColumns = 0;
        JSONArray jArray = new JSONArray();
        JSONObject jObject = new JSONObject();
        //System.out.println(defaultRec);
    	try{
    	    conn = DbProcManager.getConnection_ms();
    	    pst=conn.prepareStatement(sql);
    	    //System.out.println(sql);
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();
    	    int count = 0;
    	    while ( resultSet != null && resultSet.next() ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = resultSet.getObject(i)==null?"":resultSet.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
                ++count;
    	    }
    	    jObject.put(rootName, jArray.getJSONArraySection(start, limit)).put("totalCount",Integer.toString(count));
            if(callbackStr==null||callbackStr.isEmpty()){
                return jObject.toString();
            }else{
                return callbackStr+"("+jObject.toString()+");";
            }
    	}catch(Exception ex){
			System.err.println("Error: Unable to get a connection: " + ex);
			ex.printStackTrace(); 
			return "";
    	}finally{
            try {
                resultSet.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            try {
            	pst.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            try {
                conn.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
	}

	public boolean DbProcess (String sql ,String paramStr ,String nameId){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	int numberOfColumns = 0;
        //JSONObject obj = new JSONObject();
        JSONArray jArray = new JSONArray();        
    	try{
    	    conn = DbProcManager.getConnection_ms();
    	    //String sql1 = "select top 4000 * from T_gridDemoData";
    	    PreparedStatement pst=conn.prepareStatement(sql);
    	    //System.out.println(sql);
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    CachedRowSetImpl crs = new CachedRowSetImpl();
    	    crs.populate(resultSet);
    	    resultSet.close();
    	    pst.close();
    	    conn.close();
            //resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = crs.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();

    	    //JSONArray jColumnA = new JSONArray();
    	    JSONObject jColumnI = new JSONObject();
    	    for (int i = 1 ; i <= numberOfColumns ; ++i){
    	    	jColumnI.put("text",metaData.getColumnLabel(i) );
    	    	jColumnI.put("dataIndex",metaData.getColumnLabel(i) );
    	    	jColumnI.put("width","100" );
    	    	jarray2.put(jColumnI);
    	    }
    	    while ( crs != null && crs.next() ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = crs.getObject(i)==null?"":crs.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
    	    }
    	    this.obj.put(nameId, jArray);
    	    this.obj.put(nameId+"Column", jarray2);
    	    this.jarray = jArray;
    	}catch(Exception ex){
			System.err.println("Error: Unable to get a connection: " + ex);
			ex.printStackTrace(); 
			return false;
    	}
	    return true;
	}

    private String getCorrespondType(String typeName){
        if(typeName.equals("nvarchar")||typeName.equals("varchar")||typeName.equals("datetime")){
            return "string";
        }
        if(typeName.equals("int")){
            return "int";
        }
        if(typeName.equals("float")||typeName.equals("money")||typeName.equals("numeric")||typeName.equals("decimal")){
            return "float";
        }
        if(typeName.equals("bit")){
            return "bool";
        }
        return "";
    }
}
