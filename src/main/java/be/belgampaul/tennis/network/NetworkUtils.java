package be.belgampaul.tennis.network;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.net.URL;
import java.util.Scanner;

/**
 * User: ikka
 * Date: 4/8/14
 * Time: 4:23 AM
 */
final public class NetworkUtils {
  //logger
  private static final Logger log = Logger.getLogger(NetworkUtils.class);

  public static String getWebPageAsString(String url) throws IOException {
    long start = System.currentTimeMillis();
    String next = new Scanner(new URL(url).openStream()).useDelimiter("\\Z").next();
    long end = System.currentTimeMillis();
    log.debug("download time: " + (end - start) + "ms");
    return next;
  }
}
