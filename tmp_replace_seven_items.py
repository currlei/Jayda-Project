from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
start = '<!-- ===================== SEVEN ITEMS (separate section) -->'
end = '<!-- ===================== CELEBRANT FACTS -->'
idx1 = text.index(start)
idx2 = text.index(end)
old = text[idx1:idx2]
new = '''<!-- ===================== SEVEN ITEMS (separate section) -->
<section class="section reveal" id="seven-items">
  <div class="section-head">
    <p class="section-eyebrow">Seven Wishes &amp; Treasures</p>
    <div class="section-head-row">
      <h2 class="section-title">Seven Symbolic Items</h2>
      <button class="item-toggle" id="itemToggleBtn" aria-expanded="false">Show items</button>
    </div>
    <div class="divider"></div>
  </div>
  <div class="item-card single-card">
    <div class="item-actions">
      <button id="exportNamesBtn" class="add-cal small-btn">Export CSV</button>
      <button id="resetNamesBtn" class="add-cal small-btn alt">Reset Names</button>
    </div>
    <p class="item-card-intro">Each symbolic item holds seven guests. Tap any name to edit it, then press Enter or click away to save.</p>
    <div class="item-list collapsed" id="itemList">
      <div class="item-group">
        <h3>7 Symbolic Gifts</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="0" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="0" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="0" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="0" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="0" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="0" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="0" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Treasures</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="1" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="1" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="1" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="1" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="1" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="1" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="1" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Candles &amp; Wish</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="2" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="2" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="2" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="2" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="2" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="2" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="2" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Roses</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="3" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="3" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="3" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="3" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="3" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="3" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="3" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Dogs (stuffed toy)</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="4" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="4" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="4" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="4" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="4" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="4" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="4" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Dress</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="5" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="5" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="5" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="5" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="5" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="5" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="5" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
      <div class="item-group">
        <h3>7 Sleepwear</h3>
        <ul class="people-list">
          <li class="person-entry"><span class="person-order">1</span><span class="person-name" data-item="6" data-index="0" contenteditable="false">Guest 1</span></li>
          <li class="person-entry"><span class="person-order">2</span><span class="person-name" data-item="6" data-index="1" contenteditable="false">Guest 2</span></li>
          <li class="person-entry"><span class="person-order">3</span><span class="person-name" data-item="6" data-index="2" contenteditable="false">Guest 3</span></li>
          <li class="person-entry"><span class="person-order">4</span><span class="person-name" data-item="6" data-index="3" contenteditable="false">Guest 4</span></li>
          <li class="person-entry"><span class="person-order">5</span><span class="person-name" data-item="6" data-index="4" contenteditable="false">Guest 5</span></li>
          <li class="person-entry"><span class="person-order">6</span><span class="person-name" data-item="6" data-index="5" contenteditable="false">Guest 6</span></li>
          <li class="person-entry"><span class="person-order">7</span><span class="person-name" data-item="6" data-index="6" contenteditable="false">Guest 7</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>
'''
path.write_text(text[:idx1] + new + text[idx2:], encoding='utf-8')
print('done')
