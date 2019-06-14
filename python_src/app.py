import sys
from flask import Flask , jsonify ,request
import pandas as pd
import logging


app = Flask(__name__)
logging.basicConfig(filename='logFunctions.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')

@app.route("/upload", methods=['POST'])
def Cluster():

    # print(pd.read_csv(request.files.get('file')) , file=sys.stderr)
    # print(request.files.get('file') , file=sys.stderr)
    df = pd.read_csv(request.files.get('file'))
    logging.warning('[Cluster] : getfile')
    numeric_data = df.select_dtypes(include='number') # get all numberic attribues
    nominal_data = df.select_dtypes(exclude='number') # get all nominal/ordinal attributes

    logging.warning('[Cluster] : MinMaxScaler')
    from sklearn.preprocessing import MinMaxScaler
    mms = MinMaxScaler()
    norm_data = mms.fit_transform(numeric_data)
    norm_data=pd.DataFrame(norm_data, columns=numeric_data.columns) 
    logging.warning('[Cluster] : KMeans')
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters =5)
    logging.warning('[Cluster] : Predict')
    cluster_labels = kmeans.fit_predict(norm_data)
    logging.warning('[Cluster] : Result')
    result = pd.concat([pd.DataFrame(nominal_data) ,pd.DataFrame(cluster_labels,columns=['Cluster Labels']) ,pd.DataFrame(norm_data)], axis=1)
    logging.warning('[Cluster] : Export')
    return jsonify({"data":result.to_csv()})
