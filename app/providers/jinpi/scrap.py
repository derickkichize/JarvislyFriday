#!/usr/bin/python3

from mongoPy import migrate_process, migrate_follow_up, exists
import sys
from urllib.request import urlopen
import requests
import urllib.parse
import xmltodict
import json
import datetime
from io import BytesIO
from zipfile import ZipFile 
from urllib.request import urlopen
from progressbar import ProgressBar


url = 'http://revistas.inpi.gov.br'

"""
download a file data list from the inpi site.
"""
def get_inpi_list(dataInicial, dataFinal) :  
    path = '/rpi/busca/data?'
    query = {
        'revista.dataInicial':dataInicial,
        'revista.dataFinal':dataFinal,
        'revista.tipoRevista.id':'5'
    }
    listUrl = url + path + urllib.parse.urlencode(query, doseq=True)
    response = requests.get(listUrl)
    return response.json()

"""
prepare data for database import
"""
def magazine_parser(data):

    pbar = ProgressBar()
    obj = json.loads(json.dumps(data))

    follow_up = {
        'revista': obj['revista']['@numero'],
        'dataRevista': obj['revista']['@data'],
        'dataMigracao': datetime.datetime.utcnow()
    }

    print('preparando revista numero: ',obj['revista']['@numero'])

    for entry in pbar(obj['revista']['processo']):
        magazine = {
            'numeroRevista': obj['revista']['@numero'],
            'dataRevista': obj['revista']['@data'],
            'numeroProcesso': entry['@numero'],
        }
        magazine['processo'] = entry
        migrate_process(magazine)
    migrate_follow_up(follow_up)

    print('revista numero: ',obj['revista']['@numero'],' migrada')

"""
convert xml file to json
"""
def xml_to_json(file):
    parsed_file = xmltodict.parse(file)
    magazine_parser(parsed_file)

"""
downloads and extracts files based on the file list downloaded from inpi.
"""
def download_extract_file(item): 
    response = urlopen(url+'/txt/'+item['nomeArquivoEscritorio'])
    with ZipFile(BytesIO(response.read())) as my_zip_file:
        for contained_file in my_zip_file.namelist():
            if my_zip_file.namelist()[0].endswith('.xml'):
            
                if exists(item['numero']):
                    print('ignorando revista: ',item['numero'])
                else:
                    data = []
                    for line in my_zip_file.open(contained_file).readlines():
                        data.append(line)
                    xml_to_json(b' '.join(data).decode('utf8'));


"""
downloads and loop data from inpi.
"""
def download_loop():
    #inpiList = get_inpi_list('01/01/2000','01/01/2020')
    inpiList = get_inpi_list(sys.argv[1],sys.argv[2])
    for item in inpiList:
        if 'nomeArquivoEscritorio' in item:
            download_extract_file(item)

if __name__ == '__main__':
    download_loop()

