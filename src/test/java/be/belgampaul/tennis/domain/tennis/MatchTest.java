package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.Player;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 5:44 PM
 */
public class MatchTest {
  //logger
  private static final Logger log = Logger.getLogger(MatchTest.class);

  private Match match;
  private Player player1;
  private Player player2;

  @Before
  public void setUp() throws Exception {
    // System.out.println("");
    // System.out.println("begin setting up >>>>>");
    player1 = new Player("Nadal", "Nadal");
    player2 = new Player("Djokovic", "Djokovic");
    match = new Match(1L, null, player1, player2);
    match.init(player1, player2);
    match.setCurrentServer(player1);
    //System.out.println("<<<<< end setting up");
    //System.out.println("");
  }

  @After
  public void tearDown() throws Exception {

  }

  @Test
  public void testCalculateResult() throws Exception {

  }

  @Test
  public void testGetPlayer1() throws Exception {
    Assert.assertEquals(match.getPlayer1(), new Player("Nadal", "Nadal"));

  }

  @Test
  public void testSetPlayer1() throws Exception {

  }

  @Test
  public void testGetPlayer2() throws Exception {
    Assert.assertEquals(match.getPlayer2(), new Player("Djokovic", "Djokovic"));
  }

  @Test
  public void testGetCurrentServer() throws Exception {

  }

  @Test
  public void testSetPlayer2() throws Exception {

  }

  @Test
  public void testSetCurrentPointWinner() {

    for (int i = 0; i < 300; i++) {
      if (match.isCompleted()) {
        break;
      }
      if (Math.floor(Math.random() * 100) % 2 == 0) {
        match.setCurrentPointWinner(player1);

      } else {
        match.setCurrentPointWinner(player2);
      }
      log.debug("sctrict score:" + match.getStrictScore());
    }


  }

  @Test
  public void testPlayOneGoldenSet(){
    //match.setCurrentServer(player1);

    for (int i = 0; i < 49; i++) {
      match.setCurrentPointWinner(player1);
//        match.get
    }
  }
}
