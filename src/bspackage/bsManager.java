package bspackage;

import java.sql.*;
import javax.naming.*;
import javax.sql.*;
import org.json.*;
import com.sun.rowset.CachedRowSetImpl;

public class bsManager {

    public static Connection getConnection_ms_del(String dbName) {
        try{
            Connection conn = null;
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");// SqlDriver
            conn = DriverManager.getConnection(
                    "jdbc:sqlserver://localhost:1433;DatabaseName="+dbName,//192.168.199.122;baolong456.gicp.net;192.168.9.119;192.168.3.122
                    "007",
                    "");
            return conn;
        } catch (Exception ex) {
            System.err.println("Error: Unable to get a connection: " + ex);
            ex.printStackTrace();
        }
        return null;
    }

	public static Connection getConnection_ms(String dbName) {
		try {
			Connection conn = null;
            Context ctx = new InitialContext() ;
            DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/" + dbName) ;
            conn = ds.getConnection();
			return conn;
		} catch (Exception ex) {
			System.err.println("Error: Unable to get a connection: " + ex);
			ex.printStackTrace();
		}
		return null;
	}

/*
    public static Connection getConnection_ms(String dbName) {
        try {
            Connection conn = null;
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");// SqlDriver
            conn = DriverManager.getConnection(
                    "jdbc:sqlserver://localhost:1433;DatabaseName="+dbName,//192.168.199.122;baolong456.gicp.net;192.168.9.119;192.168.3.122
                    "002",
                    "200");
            return conn;
        } catch (Exception ex) {
            System.err.println("Error: 数据库连接失败 " + ex);
            ex.printStackTrace();
        }
        return null;
    }*/

    public String toJson( ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select menuName ,menuType from T_menu";
    	//System.out.println(sql);
    	String str = "";
        JSONStringer stringer = new JSONStringer();
        JSONArray jArray = new JSONArray();
        
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();
    	    // Get all rows.
    	    while (resultSet != null && resultSet.next()) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = resultSet.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
    	    	//resultSet.
    	    }
    	    return jArray.toString();
    	}catch(Exception ex){
    		//System.out.println("数据库错误!");
    	}
    	return "";
    }

    public String array2String(int intArray []){
        int length = intArray.length;
        String result = "";
        for( int i = 0 ; i<length ; ++i ){
            result+=String.valueOf(intArray[i])+",";
        }
        //System.out.println( result.substring(0,result.length()) );
        return result.substring(0,result.length()-1);
    }
	
	public JSONArray toJson2( ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select top 500000 * from T_gridDemoData ";
    	//System.out.println(sql);
    	String totalCount = "0";
    	JSONStringer stringer = new JSONStringer();
        JSONObject obj = new JSONObject();
        JSONArray jArray = new JSONArray();
        
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    PreparedStatement pst=conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
    	    resultSet = pst.executeQuery();
            //resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();
    	    
    	    // Get page rows.
    	    while ( resultSet != null && resultSet.next() ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = resultSet.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
    	    	//resultSet.
    	    }
    	    //obj.put("gridDemoData", jArray).put("totalCount",totalCount);
    	    //return callback+"("+obj.toString()+");";
    	    return jArray;
    	}catch(Exception ex){
    		System.err.println("数据库错误!");
    	}
    	return null;
    }

	public JSONObject toJson2( int start ,int length ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select count(*) as totalCount from T_gridDemoData ; select * from T_gridDemoData ";
    	//System.out.println(sql);
    	String totalCount = "0";
    	JSONStringer stringer = new JSONStringer();
        JSONObject obj = new JSONObject();
        JSONArray jArray = new JSONArray();
        PreparedStatement pst = null; 
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    pst=conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
    	    //resultSet = pst.executeQuery();
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    
            if (resultSet != null && resultSet.next())
            	totalCount =( Integer.toString(resultSet.getInt("totalCount")) );
            resultSet.close();
    	    pst.getMoreResults();
    	    
    	    resultSet = pst.getResultSet();
            //resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    int count = 0;
    	    numberOfColumns = metaData.getColumnCount();
    	    if (resultSet.absolute(start+1)){
        	    while ( resultSet != null && resultSet.next() && count < length ) {
        	    	JSONObject jObj = new JSONObject();
                    for (int i = 1; i <= numberOfColumns; i++) {
                        String columnName = metaData.getColumnLabel(i);
                        Object value = resultSet.getObject(i);
                        jObj.put(columnName, value.toString());
                    }
                    jArray.put(jObj);
                    count++;
        	    	//resultSet.
        	    }
    	    }
    	    // Get page rows.
    	    obj.put("gridDemoData", jArray).put("totalCount",totalCount);
    	    //return callback+"("+obj.toString()+");";
    	    return obj;
    	}catch(Exception ex){
    		System.err.println("数据库错误!");
    	}finally {
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
    	return null;
    }
	
	public JSONObject toJson3( int start ,int length ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select 4000 as totalCount from T_gridDemoData ; select top 4000 * from T_gridDemoData ";
    	//System.out.println(sql);
    	String totalCount = "0";
    	JSONStringer stringer = new JSONStringer();
        JSONObject obj = new JSONObject();
        JSONArray jArray = new JSONArray();
        
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    PreparedStatement pst=conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
    	    //resultSet = pst.executeQuery();
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    
            if (resultSet != null && resultSet.next())
            	totalCount =( Integer.toString(resultSet.getInt("totalCount")) );
            resultSet.close();
    	    pst.getMoreResults();
    	    resultSet = pst.getResultSet();
    	    
    	    CachedRowSetImpl crs = new CachedRowSetImpl();
    	    crs.populate(resultSet);
    	    resultSet.close();
    	    statement.close();
    	    conn.close();
            //resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = crs.getMetaData();
    	    int count = 0;
    	    numberOfColumns = metaData.getColumnCount();
    	    if (crs.absolute(start+1)){
        	    while ( crs != null && crs.next() && count < length ) {
        	    	JSONObject jObj = new JSONObject();
                    for (int i = 1; i <= numberOfColumns; i++) {
                        String columnName = metaData.getColumnLabel(i);
                        Object value = crs.getObject(i);
                        jObj.put(columnName, value.toString());
                    }
                    jArray.put(jObj);
                    count++;
        	    	//resultSet.
        	    }
    	    }
    	    // Get page rows.
    	    obj.put("gridDemoData", jArray).put("totalCount",totalCount);
    	    //return callback+"("+obj.toString()+");";
    	    crs.close(); 
    	    return obj;
    	}catch(Exception ex){
    		System.err.println("数据库错误!");
    	}
    	return null;
    }

	public JSONArray toJson3(){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select top 400000 * from T_gridDemoData ";
    	//System.out.println(sql);
    	String totalCount = "0";
    	JSONStringer stringer = new JSONStringer();
        JSONObject obj = new JSONObject();
        JSONArray jArray = new JSONArray();
        
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    PreparedStatement pst=conn.prepareStatement(sql);
    	    //resultSet = pst.executeQuery();
    	    pst.execute();
    	    resultSet = pst.getResultSet();
    	    CachedRowSetImpl crs = new CachedRowSetImpl();
    	    crs.populate(resultSet);
    	    resultSet.close();
    	    statement.close();
    	    conn.close();
            //resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = crs.getMetaData();
    	    int count = 0;
    	    numberOfColumns = metaData.getColumnCount();
    	    while ( crs != null && crs.next() ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = crs.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
    	    }
    	    // Get page rows.
    	    //return callback+"("+obj.toString()+");";
    	    crs.close(); 
    	    return jArray;
    	}catch(Exception ex){
    		//System.out.println("数据库错误!");
    	}
    	return null;
    }
	
	public String testDwr(String tableName ,String str1 ){
    	Connection conn = null;
    	ResultSet resultSet = null;
    	Statement statement = null;
    	int numberOfColumns = 0;
    	String sql = "select * from "+tableName+" where userName ='"+str1+"'";
    	//System.out.println(sql);
    	String str = "";
    	try{
    	    conn = bsManager.getConnection_ms("demo");
    	    statement = conn.createStatement();
    	    resultSet = statement.executeQuery(sql);
    	    ResultSetMetaData metaData = resultSet.getMetaData();
    	    numberOfColumns = metaData.getColumnCount();
    	    // Get all rows.
    	    while (resultSet != null && resultSet.next()) {
    	    	str = resultSet.getString("userName");	  
    	    	//resultSet.
    	    }    		
    	}catch(Exception ex){
    		System.err.println("数据库错误!");
    	}
    	return str;
    }
	//[saveField2]  @table nvarchar(50) ,@flh int ,@workstation nvarchar(50) ,@fieldName nvarchar(50) ,@value nvarchar(50)
	public String cellSaveDwr(String tableName ,int entry_num ,String workstation ,String fieldName ,String value ){
        String result = "";
        Connection conn = getConnection_ms("demo");
        CallableStatement proc = null;
        ResultSet rs = null;
        try {
            //conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            proc = conn.prepareCall("{ call saveField2(?,?,?,?,?) }");
            proc.setString(1, tableName);
            proc.setInt(2, entry_num);
            proc.setString(3, workstation);
            proc.setString(4, fieldName);
            proc.setString(5, value);
            rs = proc.executeQuery();
            if (rs != null && rs.next()) {
                result = rs.getString(fieldName);
            }
        } catch (Exception e) {
            result = "";
            e.printStackTrace();
        } 
        return result;
    }

/*	public String cellSaveDwr(String databasename ,String tablename ,int entryNum ,String fieldName ,String value ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        CallableStatement proc = null;
        ResultSet rs = null;
        try {
            conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            proc = conn.prepareCall("{ call saveField(?,?,?,?) }");
            proc.setInt(1, id);
            proc.setString(2, fieldName);
            proc.setString(3, value);
            proc.setInt(4, flh);
            rs = proc.executeQuery();
            if (rs != null && rs.next()) {
                result = rs.getString(fieldName);
            } else result = "";
        } catch (Exception e) {
            result = "";
            e.printStackTrace();
        } 
        return result;
    }
*/
	public String addRecordDwr( String databasename ,String tablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet rs = null;
        String sql = "";
        String sql1= "";
        String sql2= "";
        String entry_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
        	if(jarray.getJSONObject(i).getString("name").equals("id")){
        		jarray.remove(i);--i;continue;
        	}
        	if(jarray.getJSONObject(i).getString("name").equals("entry_num")){
        		entry_num = jarray.getJSONObject(i).getString("value");
        	}
        }
        PreparedStatement pst = null;
        try {
        	//System.out.println(jsonObjStr);
			String tableName = tablename;
			sql = "insert into "+tableName+"(";
			sql1= "values(";
			sql2= "select * from "+tableName+" where entry_num = "+entry_num+" ;";
			for(int i = 0 ; i<jarray.length() ; ++i){
				if(i<jarray.length()-1){
					sql += jarray.getJSONObject(i).getString("name")+",";
					sql1+= "?,";
				}else{
					sql += jarray.getJSONObject(i).getString("name")+")";
					sql1+= "?);";
				}
			}
			pst = conn.prepareStatement(sql+sql1+sql2);
			//System.out.println(sql+sql1+sql2);
			for(int i = 0 ; i<jarray.length() ; ++i){
				pst.setString(i+1, jarray.getJSONObject(i).getString("value"));
			}
			pst.execute();
         } catch (Exception e) {
            result = "";
            e.printStackTrace();
        } finally{
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
        return result;
    }

	public String insertRecordDwr( String databasename ,String tablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        //ResultSet rs = null;
        String sql = "";
        String sql1= "";
        String sql2= "";
        String workstationId = "";
        String currentEntryNum = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
        	if(jarray.getJSONObject(i).getString("name").equals("id")){
        		jarray.remove(i);--i;continue;
        	}
        	if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
        		workstationId = jarray.getJSONObject(i).getString("value");
        	}
        	if(jarray.getJSONObject(i).getString("name").equals("entry_num")){
        		currentEntryNum = jarray.getJSONObject(i).getString("value");
        	}
        }
        PreparedStatement pst = null;
        try {
        	//System.out.println(jsonObjStr);
			String tableName = tablename;
			sql = "insert into "+tableName+"(";
			sql1= "values(";
			sql2= "update "+tableName+" set entry_num = entry_num+1 where workstation_id = '"+workstationId+"' and entry_num >= "+currentEntryNum+";";
			for(int i = 0 ; i<jarray.length() ; ++i){
				if(i<jarray.length()-1){
					sql += jarray.getJSONObject(i).getString("name")+",";
					sql1+= "?,";
				}else{
					sql += jarray.getJSONObject(i).getString("name")+")";
					sql1+= "?);";
				}
			}
			pst = conn.prepareStatement(sql2+sql+sql1);
			for(int i = 0 ; i<jarray.length() ; ++i){
				pst.setString(i+1, jarray.getJSONObject(i).getString("value"));
			}
			pst.execute();
        	//System.out.println(sql2+sql+sql1);
        } catch (Exception e) {
            result = "";
            e.printStackTrace();
        } finally{
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
        return result;
    }
	
	public String deleteRecordGrid( String databasename ,String tmptablename ,String sys_id ,String workstation_id ,String work_time ,int seria_num ,int entry_num ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        //ResultSet rs = null;
        String deleteSql = "delete "+tmptablename+" where sys_id = ? and workstation_id = ? and work_time = ? and seria_num = ? and entry_num = ? ;";
        String updateSql = "update "+tmptablename+" set entry_num = entry_num-1 where sys_id = ? and workstation_id = ? and work_time = ? and seria_num = ? and entry_num > ? ;";
        //System.out.println(deleteSql);
        PreparedStatement pst = null;
        try {
            conn.setAutoCommit(false);
            pst = conn.prepareStatement(deleteSql + updateSql);
            pst.setString(1,sys_id);
            pst.setString(2, workstation_id);
            pst.setString(3,work_time);
            pst.setInt(4, seria_num);
            pst.setInt(5, entry_num);
            pst.setString(6,sys_id);
            pst.setString(7, workstation_id);
            pst.setString(8, work_time);
            pst.setInt(9, seria_num);
            pst.setInt(10,entry_num);
			pst.execute();
            conn.commit();
            conn.setAutoCommit(true);
            result = "success";
        	//System.out.println(sql+sql1+sql2);
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
            try{
                if(conn.isClosed()){
                    conn.rollback();
                    conn.setAutoCommit(true);
                }
            }catch(Exception ex){
                ex.printStackTrace();
            }
        } finally{
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
        return result;
    }
	
	public String loadSysDocument(String database ,String categroy ,String kind ,String sys_id){
        DbProcManager dpm = new DbProcManager(database);
        String sysdocumentStr = dpm.sysDocumentToJson(categroy, kind ,sys_id).toString();
        return sysdocumentStr;
    }
	
	public String loadSysDocumentDetail(String database ,String categroy ,String kind ,String sys_id){
        DbProcManager dpm = new DbProcManager(database);
        String sysdocumentStr = dpm.sysDocumentDetailToJson(categroy, kind ,sys_id).toString();
        return sysdocumentStr;
    }

    public int SYS_UpdateBasicInfo(String database ,int id ,String table ,String obj){
        Connection conn = getConnection_ms(database);
        PreparedStatement pst = null;
        //System.out.println(obj);
        String jsonStr = "["+obj+"]";
        //System.out.println(jsonStr);
        JSONArray jarray = new JSONArray(jsonStr);
        try{
            String sql = "insert into "+table+" (sys_id ,category ,kind ,caption ) select ? ,? ,? ,? where ? not in (select id from "+table+" ) ";
            //sql1= "";
            //sql2= "update "+tableName+" set entry_num = entry_num-1 where workstation_id = '"+ workstationId +"' and entry_num > "+currentEntryNum+";";
            pst = conn.prepareStatement(sql);
            pst.setString(1,jarray.getJSONObject(0).getString("sys_id"));
            pst.setString(2,jarray.getJSONObject(0).getString("category"));
            pst.setString(3,jarray.getJSONObject(0).getString("kind"));
            pst.setString(4,jarray.getJSONObject(0).getString("caption"));
            pst.setInt(5,jarray.getJSONObject(0).getInt("id"));
            pst.execute();
            pst.close();
        }catch(Exception ex){
            ex.printStackTrace();
        }finally {
            try{
                conn.close();
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        return 0;
    }

    public int SYS_UpdateTableInfo(String database ,int id ,String table ,String obj){
        Connection conn = getConnection_ms(database);
        PreparedStatement pst = null;
        ResultSet rs = null;
        //System.out.println(Integer.toString(id));
        String sql;
        //String jsonStr = "["+obj+"]";
        //System.out.println(obj);
        //JSONArray jarray = new JSONArray(jsonStr);
        try{
            sql = "update "+table+" set [property] = ? where id = ?";
            pst = conn.prepareStatement(sql);
            pst.setString(1,obj);
            pst.setInt(2,id);
            pst.execute();
            pst.close();
        }catch(Exception ex){
            ex.printStackTrace();
        }finally {
            try{
                conn.close();
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        return 0;
    }

    public String processComboSQL(String sql ,String value){
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement pst = null;
        int numberOfColumns = 0;
        //System.out.println(sql);
        String fields = "";
        try{
            conn = DbProcManager.getConnection_ms();
            pst=conn.prepareStatement(sql);
            //System.out.println(sql);
            pst.execute();
            resultSet = pst.getResultSet();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            int count = 0;
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                fields = fields + columnName + ",";
            }
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            JSONObject rJobj= new JSONObject();
            rJobj.put("result",jArray);
            return fields+"|"+rJobj.toString();
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

    public String [] processExComboSQL(String sql ,String dbName){
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement pst = null;
        int numberOfColumns = 0;
        String fields = "";
        String [] result = new String [2];
        try{
            conn = getConnection_ms(dbName);
            pst=conn.prepareStatement(sql);
            pst.execute();
            resultSet = pst.getResultSet();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            int count = 0;
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                fields = fields + columnName + ",";
            }
/*
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
*/
            //JSONObject rJobj= new JSONObject();
            result[0] = "success";
            result[1] = fields;
            //rJobj.put("result",jArray);
            return result;
        }catch(Exception ex){
            result[0] = "error";
            result[1] = ex.getMessage();
            return result;
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

    public JSONArray processTreeData( JSONArray _jArray ,String _itemKey ,String _parentKey ,JSONArray _jArray2 ,int type){
        JSONArray jarray = new JSONArray();
        if(_jArray2==null){
            for(int i = 0 ; i < _jArray.length() ; ++i){
                if( _jArray.getJSONObject(i).getString(_parentKey).equals("") ){
                    JSONArray ja2 = new JSONArray();
                    ja2.put(_jArray.getJSONObject(i));
                    JSONArray ja = processTreeData(_jArray,_itemKey,_parentKey,ja2,type);
                    if(ja.length()==0){
                        //jarray.put(_jArray.getJSONObject(i).put("leaf",true)).put(_jArray.getJSONObject(i).put("checked",true));
                        if(type==1){
                            jarray.put(_jArray.getJSONObject(i).put("leaf",true).put("checked",_jArray.getJSONObject(i).getString("checkbox").equals("1") ));
                        }else{
                            jarray.put(_jArray.getJSONObject(i).put("leaf",true));
                        }
                    }else{
                        if( i == 0 ){
                            jarray.put(_jArray.getJSONObject(i).put("children",ja).put("expanded" ,true));
                        }else{
                            jarray.put(_jArray.getJSONObject(i).put("children",ja));
                        }
                    }
                }
            }
        }else{
            for( int j = 0 ; j < _jArray2.length() ; ++j ){
                for(int i = 0 ; i < _jArray.length() ; ++i){
                    if( _jArray.getJSONObject(i).getString(_parentKey).equals(_jArray2.getJSONObject(j).getString(_itemKey)) ){
                        JSONArray ja2 = new JSONArray();
                        ja2.put(_jArray.getJSONObject(i));
                        JSONArray ja = processTreeData(_jArray,_itemKey,_parentKey,ja2,type);
                        if(ja.length()==0){
                            if(type==1){
                                jarray.put(_jArray.getJSONObject(i).put("leaf",true).put("checked",_jArray.getJSONObject(i).getString("checkbox").equals("1") ));
                            }else{
                                jarray.put(_jArray.getJSONObject(i).put("leaf",true));
                            }
                        }else{
                            if( i == 0 && j == 0){
                                jarray.put(_jArray.getJSONObject(i).put("children",ja).put("expanded" ,true));
                            }else{
                                jarray.put(_jArray.getJSONObject(i).put("children",ja));
                            }
                        }
                    }
                }
            }
        }
        return jarray;
    }

    public String processTreeComboSQL(String sql ,String value ){//type=0:SINGLE MODE ,type=1:checkbox MODE
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement pst = null;
        int numberOfColumns;
        //System.out.println(sql);
        int hasCheckbox = 0;
        String fields = "";
        try{
            conn = DbProcManager.getConnection_ms();
            pst=conn.prepareStatement(sql);
            //System.out.println(sql);
            pst.execute();
            resultSet = pst.getResultSet();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            int count = 0;
            int [] columnSize = new int[numberOfColumns];
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                fields = fields + columnName + ",";
                if(columnName.equals("checkbox")){
                    hasCheckbox = 1;
                }
            }
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    String columnValue = resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString();
                    if(columnSize[i-1]<columnValue.length()) {
                        columnSize[i-1]=columnValue.length();
                    }
                    jObj.put( columnName,columnValue );
                }
                jArray.put(jObj);
            }
            //System.out.println();
            JSONObject rJobj= new JSONObject();
            rJobj.put("children",processTreeData( jArray ,fields.split(",")[0] ,fields.split(",")[1] ,null ,hasCheckbox));
            return fields+"|"+rJobj.toString()+"|"+array2String(columnSize);
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

    public String processIndexTreeSQL(String sql ,String value){
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement pst = null;
        int numberOfColumns;
        //System.out.println(sql);
        String fields = "";
        try{
            conn = DbProcManager.getConnection_ms();
            pst = conn.prepareStatement(sql);
            //System.out.println(sql);
            pst.execute();
            resultSet = pst.getResultSet();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                fields = fields + columnName + ",";
            }
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            JSONObject rJobj= new JSONObject();
            rJobj.put("children",processTreeData( jArray ,fields.split(",")[0] ,fields.split(",")[1] ,null,0));
            //rJobj.put("result",jArray);
            return fields+"|"+rJobj.toString();
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

    public String processIndexListSQL(String sql ,String value ){
        Connection conn = null;
        ResultSet resultSet = null;
        PreparedStatement pst = null;
        int numberOfColumns;
        //System.out.println(sql);
        String fields = "";
        boolean isTree = sql.matches("(.*)Tree(.*)");
        //System.out.println(isTree);
        try{
            conn = DbProcManager.getConnection_ms();
            pst = conn.prepareStatement(sql);
            //System.out.println(sql);
            pst.execute();
            resultSet = pst.getResultSet();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                fields = fields + columnName + ",";
            }
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            JSONObject rJobj= new JSONObject();
            if(isTree){
                rJobj.put("children",processTreeData( jArray ,fields.split(",")[0] ,fields.split(",")[1] ,null ,0));
            }else{
                rJobj.put("result",jArray);
            }
            return fields+"|"+rJobj.toString();
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

    public String [] enterKeyEvents(String sqlProcName ,String _baseParam ,String _value ,String _expendParam1 ,String _expendParam2 ,int _row ,int _column){
        String [] result;
        Connection conn = DbProcManager.getConnection_ms();
        ResultSet resultSet = null;
        int numberOfColumns = 0;
        CallableStatement proc = null;
        //System.out.println(_baseParam);
        //System.out.println(sqlProcName);
        String param = _baseParam+","+_value;
        if(_expendParam1!=null){
            param = param + "," + _expendParam1;
        }
        if(_expendParam2!=null){
            param = param + "," + _expendParam2;
        }
        //System.out.println("extParam1:"+_expendParam1);
        //System.out.println("extParam2:"+_expendParam2);
        //System.out.println("Param:"+param);
        String [] paramArray = param.split(",",-2);
        String paramTag = "";
        for(int i = 0 ; i<paramArray.length ; ++i){
            paramTag = paramTag + "?,";
        }
        paramTag = paramTag + "?,?,";
        paramTag = paramTag.substring(0,paramTag.length()-1);
        //System.out.println(paramTag);
        try {
            //conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            proc = conn.prepareCall("{ call "+sqlProcName+" ("+paramTag+") }");
            for(int i = 0 ; i<paramArray.length ; ++i){
                proc.setString(i+1,paramArray[i]);
            }
            proc.setInt(paramArray.length+1,_row);
            proc.setInt(paramArray.length+2,_column);
            resultSet = proc.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            result = new String [numberOfColumns+1];
            if (resultSet != null && resultSet.next()) {
                result[0] = "success";
                for(int i = 1 ; i<= numberOfColumns ; ++i){
                    result[i] = resultSet.getString(i);
                }
            }
        } catch (Exception e) {
            result = new String [1];
            result[0] = "failure";
            e.printStackTrace();
        } finally{
            try{
                resultSet.close();
            }catch(Exception ex){
                ex.printStackTrace();
            }
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
        return result;
    }

    public String [] commonEventProc(String sqlProcName ,String param){
        String [] result = new String[2];
        Connection conn = DbProcManager.getConnection_ms();
        ResultSet resultSet = null;
        int numberOfColumns = 0;
        CallableStatement proc = null;
        //System.out.println(param);
        String [] paramArray = param.split(",",-2);
        String paramTag = "";
        for(int i = 0 ; i<paramArray.length ; ++i){
            paramTag = paramTag + "?,";
        }
        paramTag = paramTag.substring(0,paramTag.length()-1);
        //System.out.println(paramTag);
        try {
            proc = conn.prepareCall("{ call "+sqlProcName+" ("+paramTag+") }");
            for(int i = 0 ; i<paramArray.length ; ++i){
                proc.setString(i+1,paramArray[i]);
            }
            resultSet = proc.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            result[0] = "success";
            result[1] = jArray.toString();
            resultSet.close();
        } catch (Exception e) {
            result[0] = "error";
            result[1] = e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String [] commonEnterEventProc(String sqlProcName ,String param ,int _row ,int _column){
        String [] result = new String[2];
        Connection conn = DbProcManager.getConnection_ms();
        ResultSet resultSet = null;
        int numberOfColumns = 0;
        CallableStatement proc = null;
        //System.out.println(param);
        String [] paramArray = param.split(",",-2);
        String paramTag = "";
        for(int i = 0 ; i<paramArray.length ; ++i){
            paramTag = paramTag + "?,";
        }
        paramTag = paramTag+"?,?";
        //System.out.println(paramTag);
        try {
            proc = conn.prepareCall("{ call "+sqlProcName+" ("+paramTag+") }");
            for(int i = 0 ; i<paramArray.length ; ++i){
                proc.setString(i+1,paramArray[i]);
            }
            proc.setInt(paramArray.length+1,_row);
            proc.setInt(paramArray.length+2,_column);

            resultSet = proc.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            result[0] = "success";
            result[1] = jArray.toString();
            resultSet.close();
        } catch (Exception e) {
            result[0] = "error";
            result[1] = e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String insertDataForGrid ( String databasename ,String tablename ,String jsonObjStr ){
        String result;
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet = null;
        String sql;
        String sql1;
        String sql2;
        String sql3;
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String seria_num = "";
        String document_num = "";
        String currentid = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                currentid = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                seria_num = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("document_num")){
                document_num = jarray.getJSONObject(i).getString("value");
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            String tableName = tablename;
            sql2= "delete "+tableName+" where workstation_id = '"+workstationId+"' and sys_id <> '"+sys_id+"';";
            sql = "insert into "+tableName+"(";
            sql1= "values(";
            sql3= "select * from "+tableName+" where workstation_id = '"+workstationId+"' and sys_id = '"+sys_id+"' and seria_num = "+seria_num+" and work_time = '"+work_time+"';";

            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            if(jarraylength<=0){
                pst = conn.prepareStatement(sql2);
                //System.out.println(sql2);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            sql += jarray.getJSONObject(i).getString("name")+",";
                            sql1+= "?,";
                        }else{
                            sql += jarray.getJSONObject(i).getString("name")+")";
                            sql1+= "?);";
                        }
                    }
                }
                pst = conn.prepareStatement(sql2+sql+sql1);
                //System.out.println(sql+sql1+sql2);
                for(int i = 0 ,pIndex = 1 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("string")){
                            pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") || jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("bool")  ){
                            int intValue;
                            try{
                                intValue = jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") ? Integer.parseInt(jarray.getJSONObject(i).getString("value")) : ( Boolean.parseBoolean(jarray.getJSONObject(i).getString("value") ) ? 1 : 0 );
                            }catch( Exception e ){
                                intValue = 0;
                            }
                            pst.setInt(pIndex ,intValue);
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("float")){
                            float floatValue;
                            try{
                                floatValue = Float.parseFloat(jarray.getJSONObject(i).getString("value"));
                            }catch( Exception e){
                                floatValue = 0;
                            }
                            pst.setFloat(pIndex ,floatValue);
                        }

                        //pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        pIndex += 1;
                    }
                }
                pst.execute();
                pst.close();
            }
            pst = conn.prepareStatement(sql3);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success";
            }else{
                result = "failure";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String modifyDataForGrid( String databasename ,String tmptablename ,String tmptalbeview ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        String sql;
        String sql1;
        String sql2;
        String sql3;
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String seria_num = "";
        String entry_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                //currentid = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("entry_num")){
                entry_num = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                seria_num = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            String tableName = tmptablename;
            sql = "update "+tmptablename+" set ";
            sql1= "where workstation_id = '"+workstationId+"' and work_time = '"+work_time+"' and sys_id = '"+sys_id+"' and seria_num = "+seria_num+" and entry_num = "+entry_num+";";
            //sql2= "delete "+tmptablename+" where workstation_id = '"+workstationId+"';";
            sql3= "select entry_num from "+tmptalbeview+" where workstation_id = '"+workstationId+"' and sys_id = '" + sys_id + "' and seria_num = "+seria_num+" and work_time = '"+work_time+"' and entry_num = "+entry_num+";";
            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            int trueValue = 0;
            if(jarraylength<=0){
                //pst = conn.prepareStatement(sql2);
                //System.out.println(sql2);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            sql += jarray.getJSONObject(i).getString("name")+" = ? ,";
                        }else{
                            sql += jarray.getJSONObject(i).getString("name")+" = ? ";
                        }
/*
                        if(i<jarraylength-1){
                            sql += jarray.getJSONObject(i).getString("name")+" = '" + jarray.getJSONObject(i).getString("value") + "' ,";
                            //sql1+= jarray.getJSONObject(i).getString("name")+",";
                        }else{
                            sql += jarray.getJSONObject(i).getString("name")+" = '" + jarray.getJSONObject(i).getString("value") + "' ";
                            //sql1+= jarray.getJSONObject(i).getString("name")+" from " + tmptablename + " where workstation_id = '"+workstationId+"';";
                        }
*/
                    }
                }
                pst = conn.prepareStatement(sql+sql1);
                //System.out.println(sql+sql1+sql2);
                for(int i = 0 ,pIndex = 1 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("string")){
                            pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") || jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("bool")  ){
                            int intValue;
                            try{
                                intValue = jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") ? Integer.parseInt(jarray.getJSONObject(i).getString("value")) : ( Boolean.parseBoolean(jarray.getJSONObject(i).getString("value") ) ? 1 : 0 );
                            }catch( Exception e ){
                                intValue = 0;
                            }
                            pst.setInt(pIndex ,intValue);
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("float")){
                            float floatValue;
                            try{
                                floatValue = Float.parseFloat(jarray.getJSONObject(i).getString("value"));
                            }catch( Exception e){
                                floatValue = 0;
                            }
                            pst.setFloat(pIndex ,floatValue);
                        }

                        //pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        pIndex += 1;
                    }
                }

            }
            pst.execute();
            pst.close();

            pst = conn.prepareStatement(sql3);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("entry_num").toString();
            }else{
                result = "failure|";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }


    public String insertDataForForm ( String databasename ,String mainTableTmp ,String detailTableTmp ,String document_num ,String seria_num ,String jsonObjStr ){
        String result;
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet = null;
        String insertSql;
        String insertValuesSql;
        String deleteSql;
        String updateDetailSql = "";
        String resultSql;
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String currentid = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println("org:"+jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                currentid = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                jarray.getJSONObject(i).put("value",seria_num);
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("document_num")){
                jarray.getJSONObject(i).put("value",document_num);
            }
        }
        //System.out.println("new:"+jarray.toString());
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            //String tableName = tablename;
            deleteSql= "delete "+mainTableTmp+" where workstation_id = '"+workstationId+"' and sys_id = '"+sys_id+"' ;";
            insertSql = "insert into "+mainTableTmp+"(";
            insertValuesSql= "values(";
            resultSql= "select * from "+mainTableTmp+" where workstation_id = '"+workstationId+"' and sys_id = '"+sys_id+"' and seria_num = "+seria_num+" and work_time = '"+work_time+"';";
            if(detailTableTmp!=null && !detailTableTmp.equals("")){
                updateDetailSql = "update "+detailTableTmp+" set seria_num = "+seria_num+" where workstation_id = '"+workstationId+"' and sys_id = '"+sys_id+"' ;";
            }
            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            if(jarraylength<=0){
                pst = conn.prepareStatement(deleteSql);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            insertSql += jarray.getJSONObject(i).getString("name")+",";
                            insertValuesSql+= "?,";
                        }else{
                            insertSql += jarray.getJSONObject(i).getString("name")+")";
                            insertValuesSql+= "?);";
                        }
                    }
                }
                pst = conn.prepareStatement(deleteSql+insertSql+insertValuesSql+updateDetailSql);
                //System.out.println(deleteSql+insertSql+insertValuesSql+updateDetailSql);
                for(int i = 0 ,pIndex = 1 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("string")){
                            pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") || jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("bool")  ){
                            int intValue;
                            try{
                                intValue = jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("int") ? Integer.parseInt(jarray.getJSONObject(i).getString("value")) : ( Boolean.parseBoolean(jarray.getJSONObject(i).getString("value") ) ? 1 : 0 );
                            }catch( Exception e ){
                                intValue = 0;
                            }
                            pst.setInt(pIndex ,intValue);
                        }
                        if(jarray.getJSONObject(i).getJSONObject("type").getString("type").equals("float")){
                            float floatValue;
                            try{
                                floatValue = Float.parseFloat(jarray.getJSONObject(i).getString("value"));
                            }catch( Exception e){
                                floatValue = 0;
                            }
                            pst.setFloat(pIndex ,floatValue);
                        }

                            //pst.setString(pIndex, jarray.getJSONObject(i).getString("value"));
                        pIndex += 1;
                    }
                }
                pst.execute();
                pst.close();
            }
            //System.out.println(resultSql);
            pst = conn.prepareStatement(resultSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success";
            }else{
                //System.out.println(deleteSql+insertSql+insertValuesSql+updateDetailSql);
                //System.out.println(resultSql);
                result = "failure";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String getSeriaObj(String databasename ,String sys_id ,String work_time ,int numLength) {
        JSONObject seriaObj = new JSONObject();
        Connection conn = getConnection_ms(databasename);
        CallableStatement proc = null;
        ResultSet resultSet = null;
        try {
            conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            proc = conn.prepareCall("{ call sys_get_seria_num(?,?,?) }");
            proc.setString(1,sys_id);
            proc.setString(2,work_time);
            proc.setInt(3,numLength);
            resultSet = proc.executeQuery();
            if (resultSet != null && resultSet.next()) {
                seriaObj.put("document_num",resultSet.getString("document_num"));
                seriaObj.put("seria_num",resultSet.getInt("seria_num"));
            }
            resultSet.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                proc.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                conn.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return seriaObj.toString();
    }

    public String saveDataForGrid( String databasename ,String tablename ,String tmptablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        String sqlUpdate = "";
        String sqlInsertField = "";
        String sqlInsertSelect = "";
        String sqlDelete1 = "";
        String sqlDelete2 = "";
        String sqlResult = "";
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String seria_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
                //jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                seria_num = jarray.getJSONObject(i).getString("value");
                //jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
                //jarray.remove(i);--i;continue;
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            //String tableName = tablename;
            sqlUpdate = "update "+tablename+" set ";
            sqlInsertField = "insert into "+tablename+" (";
            sqlInsertSelect = "select ";
            sqlDelete1= "delete "+tablename+" from "+tablename+" a left join "+tmptablename+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and b.workstation_id = '"+workstationId+"'  ) where b.seria_num is null and a.seria_num = " + seria_num + " and a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"';";
            sqlDelete2= "delete "+tmptablename+" where workstation_id = '"+workstationId+"' and sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num ="+seria_num+" ;";
            sqlResult = "select count(*) as resultCount from "+tablename+" where seria_num = " + seria_num + " and sys_id = '"+sys_id+"' and work_time = '"+work_time+"';";
            //sql3= "select document_num from "+tablename+" where document_num = '"+document_num+"';";
            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            if(jarraylength<=0){
                pst = conn.prepareStatement(sqlDelete2);
                //System.out.println(sql2);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            sqlUpdate += jarray.getJSONObject(i).getString("name") + "=b."+jarray.getJSONObject(i).getString("name")+",";
                            sqlInsertField += jarray.getJSONObject(i).getString("name")+",";
                            sqlInsertSelect += "a."+jarray.getJSONObject(i).getString("name")+",";
                        }else{
                            sqlUpdate += jarray.getJSONObject(i).getString("name") + "=b."+jarray.getJSONObject(i).getString("name")+" from "+tablename+" a join "+tmptablename+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and b.workstation_id = '"+workstationId+"' ) where a.seria_num = " + seria_num + " and a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"';";
                            sqlInsertField += jarray.getJSONObject(i).getString("name")+") ";
                            sqlInsertSelect += "a."+jarray.getJSONObject(i).getString("name")+" from "+tmptablename+" a left join "+tablename+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and a.workstation_id = '"+workstationId+"' ) where b.seria_num is null and a.seria_num = " + seria_num + " and a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"';";
                        }
                    }
                }
                pst = conn.prepareStatement(sqlUpdate+sqlInsertField+sqlInsertSelect+sqlDelete1+sqlDelete2);
                //System.out.println(sqlUpdate+sqlInsertField+sqlInsertSelect+sqlDelete1);
            }
            pst.execute();
            pst.close();

            pst = conn.prepareStatement(sqlResult);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("resultCount").toString();
            }else{
                result = "failure";
            }
            resultSet.close();

        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }


    public String saveDataForForm( String databasename ,String tablename ,String tmptablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        String sql;
        String sql1;
        String sql2;
        String sql3;
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String seria_num = "";
        String document_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                seria_num = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
            }
            if(jarray.getJSONObject(i).getString("name").equals("document_num")){
                document_num = jarray.getJSONObject(i).getString("value");
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            String tableName = tablename;
            sql = "insert into "+tableName+"(";
            sql1= "select ";
            sql2= "delete "+tmptablename+" where workstation_id = '"+workstationId+"';";
            sql3= "select document_num from "+tableName+" where document_num = '"+document_num+"';";
            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            if(jarraylength<=0){
                pst = conn.prepareStatement(sql2);
                //System.out.println(sql2);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            sql += jarray.getJSONObject(i).getString("name")+",";
                            sql1+= jarray.getJSONObject(i).getString("name")+",";
                        }else{
                            sql += jarray.getJSONObject(i).getString("name")+")";
                            sql1+= jarray.getJSONObject(i).getString("name")+" from " + tmptablename + " where workstation_id = '"+workstationId+"';";
                        }
                    }
                }
                pst = conn.prepareStatement(sql+sql1+sql2);
                //System.out.println(sql+sql1+sql2);
            }
            pst.execute();
            pst.close();

            pst = conn.prepareStatement(sql3);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("document_num").toString();
            }else{
                result = "failure";
            }
            resultSet.close();

        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String delDataForForm( String databasename ,String tablename ,String tmptablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        String sql;
        String sql1;
        String sql2;
        String sql3;
        String workstationId = "";
        String document_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                //currentid = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("document_num")){
                document_num = jarray.getJSONObject(i).getString("value");
                //System.out.println(jarray.getJSONObject(i).getString("value"));
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            String tableName = tablename;
            sql = "";
            sql1= "delete "+tablename+" where document_num = '"+document_num+"';";
            sql2= "delete "+tmptablename+" where workstation_id = '"+workstationId+"';";
            sql3= "select document_num from "+tableName+" where document_num = '"+document_num+"';";
            pst = conn.prepareStatement(sql+sql1+sql2);
            //System.out.println(sql+sql1+sql2);
            pst.execute();
            pst.close();

            pst = conn.prepareStatement(sql3);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "failure|"+resultSet.getObject("document_num").toString();
            }else{
                result = "success|"+document_num;
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String modifyDataForForm( String databasename ,String tablename ,String tmptablename ,String jsonObjStr ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        String sql;
        String sql1;
        String sql2;
        String sql3;
        String workstationId = "";
        String sys_id = "";
        String work_time = "";
        String seria_num = "";
        String document_num = "";
        jsonObjStr = "["+jsonObjStr+"]";
        //System.out.println(jsonObjStr);
        JSONArray jarray = new JSONArray(jsonObjStr);
        for(int i = 0 ; i<jarray.length();++i){
            if(jarray.getJSONObject(i).getString("name").equals("id")){
                //currentid = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("document_num")){
                document_num = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("workstation_id")){
                workstationId = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("sys_id")){
                sys_id = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("seria_num")){
                seria_num = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
            if(jarray.getJSONObject(i).getString("name").equals("work_time")){
                work_time = jarray.getJSONObject(i).getString("value");
                jarray.remove(i);--i;continue;
            }
        }
        PreparedStatement pst = null;
        try {
            //System.out.println(jsonObjStr);
            String tableName = tablename;
            sql = "update "+tableName+" set ";
            sql1= "from "+tableName+" a join "+tmptablename+" b on (a.seria_num = b.seria_num and b.workstation_id = '"+workstationId+"')";
            sql2= "delete "+tmptablename+" where workstation_id = '"+workstationId+"';";
            sql3= "select document_num from "+tableName+" where sys_id = '" + sys_id + "' and seria_num = "+seria_num+" and work_time = '"+work_time+"' and document_num = '"+document_num+"';";
            int jarraylength = -1;
            for(int i = 0 ; i< jarray.length() ;++i){
                if(jarray.getJSONObject(i).getString("saveable").equals("1"))jarraylength = i;
            }
            jarraylength = jarraylength + 1;
            if(jarraylength<=0){
                pst = conn.prepareStatement(sql2);
                //System.out.println(sql2);
            }else{
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(jarray.getJSONObject(i).getString("saveable").equals("1")){
                        if(i<jarraylength-1){
                            sql += jarray.getJSONObject(i).getString("name")+" = b." + jarray.getJSONObject(i).getString("name") + " ,";
                            //sql1+= jarray.getJSONObject(i).getString("name")+",";
                        }else{
                            sql += jarray.getJSONObject(i).getString("name")+" = b." + jarray.getJSONObject(i).getString("name") + " ";
                            //sql1+= jarray.getJSONObject(i).getString("name")+" from " + tmptablename + " where workstation_id = '"+workstationId+"';";
                        }
                    }
                }
                pst = conn.prepareStatement(sql+sql1+sql2);
                //System.out.println(sql+sql1+sql2);
            }
            pst.execute();
            pst.close();

            pst = conn.prepareStatement(sql3);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("document_num").toString();
            }else{
                result = "failure|"+document_num;
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String loadDataToTableTemp ( String databasename ,String mainTableStr ,String mainJsonObjStr ,String detailTableStr ,String detailJsonObjStr ,String document_num ,String seria_num ,String workstation_id ){
        String result = "";
        String mainTableTmp;
        String mainTable;
        String detailTableTmp;
        String detailTable;
        boolean hasDetail = true;
        try{
            mainTableTmp = mainTableStr.split(",")[1];
            mainTable = mainTableStr.split(",")[0];
        }catch(Exception e){
            result = "failure|"+"请检查主表配置。";
            return result;
        }

        try{
            detailTableTmp = detailTableStr.split(",")[1];
            detailTable = detailTableStr.split(",")[0];
        }catch(Exception e){
            detailTableTmp = "";
            detailTable = "";
            hasDetail = false;
        }

        String mainInsertSql = "";
        String mainSelectSql = "";

        String detailInsertSql = "";
        String detailSelectSql = "";

        String deleteOldTableTmp;
        String resultSql;
        if(hasDetail){
            deleteOldTableTmp = "delete "+mainTableTmp+" where workstation_id = '"+workstation_id+"' ;delete "+detailTableTmp+" where workstation_id = '"+workstation_id+"' ;";
            resultSql = "select a.document_num ,count(*) as resultCount from "+mainTableTmp+" a left join "+detailTableTmp+" b on ( a.sys_id = b.sys_id and a.seria_num = b.seria_num and a.work_time = b.work_time and a.workstation_id = b.workstation_id ) where a.document_num = '"+document_num+"' group by a.document_num";
        }else{
            deleteOldTableTmp = "delete "+mainTableTmp+" where workstation_id = '"+workstation_id+"' ;";
            resultSql = "select document_num ,count(*) as resultCount from "+mainTableTmp+" where document_num = '"+document_num+"' group by document_num";
        }

        //System.out.println(mainJsonObjStr);
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        PreparedStatement pst = null;
        try {
            mainJsonObjStr = "["+mainJsonObjStr+"]";
            JSONArray mainjarray = new JSONArray(mainJsonObjStr);

            int jarraylength = mainjarray.length();
            if(jarraylength>0){
                mainInsertSql = "insert into "+ mainTableTmp +" (";
                mainSelectSql = "select ";
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(i<jarraylength-1){
                        mainInsertSql += mainjarray.getJSONObject(i).getString("name") + " ,";
                        if(mainjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                            mainSelectSql += "'"+workstation_id+"' ,";
                        }else{
                            mainSelectSql += mainjarray.getJSONObject(i).getString("name")+" ,";
                        }
                    }else{
                        mainInsertSql += mainjarray.getJSONObject(i).getString("name") + " )";
                        if(mainjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                            mainSelectSql += "'"+workstation_id + "' from "+mainTable +" where document_num='"+document_num+"' ;";
                        }else{
                            mainSelectSql += mainjarray.getJSONObject(i).getString("name")+" from "+mainTable +" where document_num='"+document_num+"' ;";
                        }

                    }
                }
            }
            if(hasDetail){
                JSONArray detailjarray;

                detailJsonObjStr = "["+detailJsonObjStr+"]";
                detailjarray = new JSONArray(detailJsonObjStr);
                jarraylength = detailjarray.length();
                if(jarraylength>0){
                    detailInsertSql = "insert into "+ detailTableTmp +" (";
                    detailSelectSql = "select ";
                    for(int i = 0 ; i<jarraylength ; ++i){
                        if(i<jarraylength-1){
                            detailInsertSql += detailjarray.getJSONObject(i).getString("name") + " ,";
                            if(detailjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                                detailSelectSql += "'"+workstation_id+"' ,";
                            }else{
                                detailSelectSql += detailjarray.getJSONObject(i).getString("name")+" ,";
                            }
                        }else{
                            detailInsertSql += detailjarray.getJSONObject(i).getString("name") + " )";
                            if(detailjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                                detailSelectSql += "'"+workstation_id + "' from "+detailTable +" where seria_num ="+seria_num+" ;";
                            }else{
                                detailSelectSql += detailjarray.getJSONObject(i).getString("name")+" from "+detailTable +" where seria_num = "+seria_num+" ;";
                            }

                        }
                    }
                }
            }

            pst = conn.prepareStatement(deleteOldTableTmp+mainInsertSql+mainSelectSql+detailInsertSql+detailSelectSql);
            //System.out.println(deleteOldTableTmp+mainInsertSql+mainSelectSql+detailInsertSql+detailSelectSql);

            pst.execute();
            pst.close();

            pst = conn.prepareStatement(resultSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("document_num").toString();
            }else{
                result = "failure|"+document_num;
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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

        return result;
    }

    public String saveDataForFrame( String databasename ,String mainTableStr ,String mainJsonObjStr ,String detailTableStr ,String detailJsonObjStr ,String sys_id ,String work_time ,String workstation_id ,String document_num ,String seria_num ){
        String result = "";
        boolean hasDetail = true;
        String mainTableTmp;
        String mainTable;
        try{
            mainTableTmp = mainTableStr.split(",")[1];
            mainTable = mainTableStr.split(",")[0];
        }catch(Exception e){
            result = "failure|"+"请检查主表配置。";
            return result;
        }

        String detailTableTmp;
        String detailTable;
        try{
            detailTableTmp = detailTableStr.split(",")[1];
            detailTable = detailTableStr.split(",")[0];
        }catch(Exception e){
            detailTable = "";
            detailTableTmp = "";
            hasDetail = false;
        }

        String mainUpdateSql = "";
        String mainInsertSql = "";
        String mainSelectSql = "";
        String mainDeleteTempSql = "delete "+mainTableTmp+" where workstation_id = '"+workstation_id+"' and sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and document_num = '"+document_num+"';";

        String detailUpdateSql = "";
        String detailInsertSql = "";
        String detailSelectSql = "";
        String detailDeleteSql = "";
        String detailDeleteTempSql = "";

        String resultSql;
        if(hasDetail){
            resultSql = "select a.document_num ,count(*) as resultCount from "+mainTable+" a left join "+detailTable+" b on ( a.sys_id = b.sys_id and a.seria_num = b.seria_num and a.work_time = b.work_time ) where a.document_num = '"+document_num+"' group by a.document_num";
        }else{
            resultSql = "select document_num ,count(*) as resultCount from "+mainTable+" where document_num = '"+document_num+"' group by document_num";
        }

        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        PreparedStatement pst = null;
        try {
            mainJsonObjStr = "["+mainJsonObjStr+"]";
            JSONArray mainjarray = new JSONArray(mainJsonObjStr);
            for(int i = 0 ; i<mainjarray.length();++i){
                if(mainjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                    mainjarray.remove(i);
                    break;
                }
            }
            int jarraylength = mainjarray.length();
            if(jarraylength>0){
                mainUpdateSql = "update "+mainTable+" set ";
                mainInsertSql = "insert into "+ mainTable +" (";
                mainSelectSql = "select ";
                for(int i = 0 ; i<jarraylength ; ++i){
                    if(i<jarraylength-1){
                        mainUpdateSql += "["+mainjarray.getJSONObject(i).getString("name") + "] = b.["+mainjarray.getJSONObject(i).getString("name")+"] ,";
                        mainInsertSql += "["+mainjarray.getJSONObject(i).getString("name") + "] ,";
                        mainSelectSql += "b.["+mainjarray.getJSONObject(i).getString("name") + "] ,";
                    }else{
                        mainUpdateSql += "["+mainjarray.getJSONObject(i).getString("name") + "] = b.["+mainjarray.getJSONObject(i).getString("name")+"] from "+mainTable+" a join "+mainTableTmp+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num ) where a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"' and a.document_num = '"+document_num+"' and b.workstation_id = '"+workstation_id+"' ;";
                        mainInsertSql += "["+mainjarray.getJSONObject(i).getString("name") + "] )";
                        mainSelectSql += "b.["+mainjarray.getJSONObject(i).getString("name") + "] from "+mainTable+" a right join "+mainTableTmp+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num ) where a.sys_id is null and b.sys_id = '"+sys_id+"' and b.work_time = '"+work_time+"' and b.workstation_id = '"+workstation_id+"' and b.document_num ='"+document_num+"' ;";
                    }
                }
            }
            if(hasDetail){
                detailJsonObjStr = "["+detailJsonObjStr+"]";
                JSONArray detailjarray = new JSONArray(detailJsonObjStr);
                for(int i = 0 ; i<detailjarray.length();++i){
                    if(detailjarray.getJSONObject(i).getString("name").equals("workstation_id")){
                        detailjarray.remove(i);
                        break;
                    }
                }
                jarraylength = detailjarray.length();
                if(jarraylength>0){
                    detailUpdateSql = "update "+detailTable+" set ";
                    detailInsertSql = "insert into "+ detailTable +" (";
                    detailSelectSql = "select ";
                    detailDeleteSql = "delete "+detailTable+" from "+detailTable+" a left join "+detailTableTmp+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and a.entry_num = b.entry_num and b.workstation_id = '"+workstation_id+"' ) where b.sys_id is null and a.seria_num = "+seria_num+" and a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"' ;";
                    detailDeleteTempSql = "delete "+detailTableTmp+" where workstation_id = '"+workstation_id+"' and sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num = "+seria_num+" ;";
                    for(int i = 0 ; i<jarraylength ; ++i){
                        if(i<jarraylength-1){
                            detailUpdateSql += "["+detailjarray.getJSONObject(i).getString("name")+"] = b.["+detailjarray.getJSONObject(i).getString("name")+"] ,";
                            detailInsertSql += "["+detailjarray.getJSONObject(i).getString("name") + "] ,";
                            detailSelectSql += "b.["+detailjarray.getJSONObject(i).getString("name")+"] ,";
                        }else{
                            detailUpdateSql += "["+detailjarray.getJSONObject(i).getString("name")+"] = b.["+detailjarray.getJSONObject(i).getString("name")+"] from "+detailTable+" a join "+detailTableTmp+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and a.entry_num = b.entry_num ) where a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"' and a.seria_num = "+seria_num+" and b.workstation_id = '"+workstation_id+"' ;";
                            detailInsertSql += "["+detailjarray.getJSONObject(i).getString("name") + "] )";
                            detailSelectSql += "b.["+detailjarray.getJSONObject(i).getString("name")+"] from "+detailTable +" a right join "+detailTableTmp+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num and a.entry_num = b.entry_num ) where a.sys_id is null and b.sys_id = '"+sys_id+"' and b.work_time = '"+work_time+"' and b.seria_num = "+seria_num+" and b.workstation_id = '"+workstation_id+"' ;";
                        }
                    }
                }
            }
            pst = conn.prepareStatement(mainUpdateSql+mainInsertSql+mainSelectSql+detailUpdateSql+detailInsertSql+detailSelectSql+detailDeleteSql+mainDeleteTempSql+detailDeleteTempSql);
            //System.out.println(mainUpdateSql+mainInsertSql+mainSelectSql+detailUpdateSql+detailInsertSql+detailSelectSql+detailDeleteSql+mainDeleteTempSql+detailDeleteTempSql);

            pst.execute();
            pst.close();

            pst = conn.prepareStatement(resultSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("document_num").toString();
            }else{
                result = "failure|"+document_num;
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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

        return result;
    }

    public String checkSeriaNumForFrame( String databasename ,String mainTable ,String detailTable ,String sys_id ,String work_time ,String seria_num ,String document_num ){
        String result = "";
        boolean hasDetail;

        String checkSql = "";
        String detailDeleteSql = "";

        if(detailTable!=null && !detailTable.isEmpty()){
            hasDetail = true;
        }else{
            hasDetail = false;
        }

        String resultSql;
        if(hasDetail){
            resultSql = "select count(*) as resultCount from "+mainTable+" a left join "+detailTable+" b on ( a.sys_id = b.sys_id and a.seria_num = b.seria_num and a.work_time = b.work_time ) where ( a.document_num <> '' and a.document_num = '"+document_num+"' ) or ( a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"' and a.seria_num = "+seria_num+" ) ;";
        }else{
            resultSql = "select count(*) as resultCount from "+mainTable+" a where ( a.document_num <> '' and a.document_num = '"+document_num+"' ) or ( a.sys_id = '"+sys_id+"' and a.work_time = '"+work_time+"' and a.seria_num = "+seria_num+" ) ;";
        }

        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        PreparedStatement pst = null;
        try {
            pst = conn.prepareStatement(resultSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("resultCount").toString();
            }else{
                result = "failure|";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }


    public String newDataForFrame( String databasename ,String mainTableTmp ,String detailTableTmp ,String sys_id ,String workstation_id ){
        String result = "";
        boolean hasDetail = true;

        String mainTempDeleteSql = "";
        String detailTempDeleteSql = "";

        if(mainTableTmp!=null && !mainTableTmp.isEmpty()){
            mainTempDeleteSql = "delete "+mainTableTmp+" where workstation_id = '"+workstation_id+"' and sys_id = '"+sys_id+"' ;";
            //original : mainTempDeleteSql = "delete "+mainTableTmp+" where document_num = '' and seria_num = 0 and workstation_id = '"+workstation_id+"' and sys_id = '"+sys_id+"' ;";
        }
        if(detailTableTmp!=null && !detailTableTmp.isEmpty()){
            detailTempDeleteSql = "delete "+detailTableTmp+" where workstation_id = '"+workstation_id+"' and sys_id = '"+sys_id+"' ;";
        }else{
            hasDetail = false;
        }

        String resultSql;
        if(hasDetail){
            resultSql = "select count(*) as resultCount from "+mainTableTmp+" a left join "+detailTableTmp+" b on ( a.sys_id = b.sys_id and a.seria_num = b.seria_num and a.work_time = b.work_time and a.workstation_id = b.workstation_id ) where a.document_num = '' and a.seria_num = 0 and a.workstation_id = '"+workstation_id+"' ;";
        }else{
            resultSql = "select count(*) as resultCount from "+mainTableTmp+" where document_num = '' and workstation_id = '"+workstation_id+"' ;";
        }
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        PreparedStatement pst = null;
        try {
            pst = conn.prepareStatement(mainTempDeleteSql+detailTempDeleteSql);
            //System.out.println(mainTempDeleteSql+detailTempDeleteSql);

            pst.execute();
            pst.close();

            pst = conn.prepareStatement(resultSql);
            //System.out.println(resultSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getObject("resultCount").toString();
            }else{
                result = "failure|";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }

    public String deleteDataForFrame( String databasename ,String mainTable ,String detailTable ,String document_num ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        boolean hasDetail = true;
        String mainDeleteSql = "";
        String detailDeleteSql = "";
        String sql2;
        String resultSql;
        if(mainTable!=null && !mainTable.isEmpty()){
            mainDeleteSql = "delete "+mainTable+" where document_num = '"+document_num+"' ;";
        }
        if(detailTable!=null && !detailTable.isEmpty()){
            detailDeleteSql = "delete "+detailTable+" from "+mainTable+" a join "+detailTable+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num ) where a.document_num = '"+document_num+"' ;";
        }else{
            hasDetail = false;
        }
        if(hasDetail){
            resultSql = "select a.document_num from "+mainTable+" a left join "+detailTable+" b on ( a.sys_id = b.sys_id and a.work_time = b.work_time and a.seria_num = b.seria_num ) where a.document_num = '"+document_num+"';";
        }else{
            resultSql = "select document_num from "+mainTable+" where document_num = '"+document_num+"';";
        }

        PreparedStatement pst = null;
        try {
            conn.setAutoCommit(false);
            pst = conn.prepareStatement(detailDeleteSql+mainDeleteSql);
            //System.out.println(detailDeleteSql+mainDeleteSql);
            pst.execute();
            conn.commit();
            //pst.executeUpdate(detailDeleteSql);
            //pst.executeUpdate(mainDeleteSql);
            pst.close();

            pst = conn.prepareStatement(resultSql);
            //System.out.println(resultSql);
            resultSet = pst.executeQuery();
            conn.commit();
            if ( resultSet != null && resultSet.next() ) {
                result = "failure|"+resultSet.getObject("document_num").toString();
            }else{
                result = "success|"+document_num;
            }
            resultSet.close();
            conn.setAutoCommit(true);
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
            try{
                if(!conn.isClosed()){
                    conn.rollback();
                    conn.setAutoCommit(true);
                    //System.out.println("[deleteDataForFrame]:执行失败,操作回滚...");
                }
            }catch(Exception ex){
                ex.printStackTrace();
            }
        } finally{
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
        return result;
    }

    public String getLocationForModel( String databasename ,String mainTable ,String sys_id ,String work_time ,String seria_num ){
        String result = "";
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet;
        boolean hasDetail = true;
        String countSql = "select case when "+seria_num+" < 0 then cast(total+1 as nvarchar(50)) else cast(location as nvarchar(50)) end +','+cast(total as nvarchar(50)) as location from ( select count(*) as location from "+mainTable+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num <= "+seria_num+" ) a cross join ( select count(*) as total from "+mainTable+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' ) b";
        //System.out.println(countSql);
        PreparedStatement pst = null;
        try {
            pst = conn.prepareStatement(countSql);
            resultSet = pst.executeQuery();
            if ( resultSet != null && resultSet.next() ) {
                result = "success|"+resultSet.getString("location");
            }else{
                result = "failure|";
            }
            resultSet.close();
        } catch (Exception e) {
            result = "error|"+e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }


    public String [] initDefaultRecord ( String databasename ,String recordStructure ){
        String [] result = new String [2];
        //System.out.println(recordStructure);
        Connection conn = getConnection_ms(databasename);
        ResultSet resultSet = null;
        String defaultRecordSql = "";
        String resultSql;
        recordStructure = "["+recordStructure+"]";
        //System.out.println("org:"+jsonObjStr);
        JSONArray jarray = new JSONArray(recordStructure);
        for(int i = 0 ; i<jarray.length();++i){
            String tmpString;
            if( jarray.getJSONObject(i).getString("type").equals("int") ){
                tmpString = jarray.getJSONObject(i).getString("defaultValue").isEmpty() ? "0" : jarray.getJSONObject(i).getString("defaultValue");
                defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("name");
            }
            if( jarray.getJSONObject(i).getString("type").equals("float") ){
                tmpString = jarray.getJSONObject(i).getString("defaultValue").isEmpty() ? "0" : jarray.getJSONObject(i).getString("defaultValue");
                defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("name");
            }
            if( jarray.getJSONObject(i).getString("type").equals("bool") ){
                tmpString = jarray.getJSONObject(i).getString("defaultValue").isEmpty() ? "0" : jarray.getJSONObject(i).getString("defaultValue");
                defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("name");
            }
            if( jarray.getJSONObject(i).getString("type").equals("string") ){
                tmpString = jarray.getJSONObject(i).getString("defaultValue").isEmpty() ? "''" : jarray.getJSONObject(i).getString("defaultValue");
                defaultRecordSql = defaultRecordSql + tmpString + " as " + jarray.getJSONObject(i).getString("name");
            }
            if( (i+1)<jarray.length() ){
                defaultRecordSql = defaultRecordSql + " ,";
            }
        }
        defaultRecordSql = "select "+defaultRecordSql;
        //System.out.println(defaultRecordSql);
        PreparedStatement pst = null;
        /*defaultRecordSql = "select \n" +
                "cast( '' as nvarchar(50) ) as [NVARCHAR] ,\n" +
                "cast( '' as nvarchar(max) ) as [NVARCHAR1] ,\n" +
                "cast( '' as varchar(50) ) as [VARCHAR] ,\n" +
                "cast(1 as int) as [INT] ,\n" +
                "cast(1.00 as money) as [money] ,\n" +
                "cast(1.01 as float) as [float],\n" +
                "cast(getdate() as datetime) as [DATETIME] ,\n" +
                "cast(1.00001 as numeric(18,5) ) as [numeric] ,\n" +
                "cast(1 as bit) as [bit]\n";*/
        try {
            //int jarraylength = -1;
            pst = conn.prepareStatement(defaultRecordSql);
            resultSet = pst.executeQuery();
            JSONArray resultJArray = new JSONArray();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int numberOfColumns = metaData.getColumnCount();
            if(resultSet != null && resultSet.next()){
                JSONObject jobj;
                for (int i = 1; i <= numberOfColumns; i++) {
                    jobj = new JSONObject();
                    String columnName = metaData.getColumnLabel(i);
                    String columnType = getCorrespondType(metaData.getColumnTypeName(i));
                    Object value = resultSet.getObject(i);
                    if(columnType.equals("int")){
                        jobj.put( columnName ,Integer.valueOf(value.toString()) );
                    }else{
                        if(columnType.equals("float")){
                            jobj.put( columnName ,Float.valueOf(value.toString()) );
                        }else{
                            jobj.put( columnName ,value.toString() );
                        }
                    }
                    jobj.put("type" ,columnType);
                    resultJArray.put(jobj);
                }
            }
            try{
                resultSet.close();
            }catch (Exception ex){
                ex.getMessage();
            }
            pst.close();
            result[1]=resultJArray.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally{
            try {
                pst.close();
            } catch (Exception ex) {
                ex.getMessage();
            }
            try {
                conn.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return result;
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
    public String [] loginProcess( String databaseName ,String loginId ,String password ){
        String [] result = new String[2];
        Connection conn = getConnection_ms(databaseName);
        ResultSet resultSet = null;
        int numberOfColumns = 0;
        CallableStatement proc = null;
        try {
            proc = conn.prepareCall("{ call sys_login_process (?,?) }");
            proc.setString(1,loginId);
            proc.setString(2,password);
            resultSet = proc.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            numberOfColumns = metaData.getColumnCount();
            JSONArray jArray = new JSONArray();
            while ( resultSet != null && resultSet.next() ) {
                JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; ++i) {
                    String columnName = metaData.getColumnLabel(i);
                    jObj.put(columnName,( resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString() ) );
                }
                jArray.put(jObj);
            }
            if(jArray.length()>0){
                result[0] = "success";
            }else{
                result[0] = "failure";
            }
            result[1] = jArray.toString();
            resultSet.close();
        } catch (Exception e) {
            result[0] = "error";
            result[1] = e.getMessage();
            e.printStackTrace();
        } finally{
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
        return result;
    }
}