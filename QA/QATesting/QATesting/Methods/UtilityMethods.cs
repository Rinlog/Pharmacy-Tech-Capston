using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.Methods
{
    internal class UtilityMethods
    {
        /// <summary>
        /// Will check if the file name specified has been downloaded up to 1 minute ago
        /// </summary>
        /// <param name="FileName"></param>
        /// <returns></returns>
        public static bool CheckIfDownloaded(string FileName)
        {
            //now to verify a download we check the downloads folder, removing the file once we detect it

            string LocalDownloads = System.Environment.GetEnvironmentVariable("USERPROFILE") + "\\Downloads";
            string[] filesInDownload = Directory.GetFiles(LocalDownloads);

            //waits until it can find it with a 30 second buffer
            for (int i = 0; i < 30; i++)
            {
                filesInDownload = Directory.GetFiles(LocalDownloads);
                foreach (var file in filesInDownload)
                {
                    if (file.Contains(FileName))
                    {
                        FileInfo FileToDelete = new FileInfo(file);

                        //checking if the file was last modified a minute ago or less
                        //on the right the number should be -60,
                        //and on the left if 2 minutes have passed it will be -120
                        if (FileToDelete.LastWriteTime.Subtract(DateTime.Now) >= DateTime.Now.Subtract(DateTime.Now.AddMinutes(1)))
                        {
                            FileToDelete.Delete();
                            return true;
                        }
                        break;
                    }
                }
                Thread.Sleep(1000);
            }
            return false;
        }
    }
}
