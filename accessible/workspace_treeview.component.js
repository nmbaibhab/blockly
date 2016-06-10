/**
 * AccessibleBlockly
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Angular2 Component that details how Blockly.Block's are
 * rendered in the workspace in AccessibleBlockly. Also handles any
 * interactions with the blocks.
 * @author madeeha@google.com (Madeeha Ghori)
 */

blocklyApp.WorkspaceTreeView = ng.core
  .Component({
    selector: 'tree-view',
    template: `
    <li #parentList [id]="idMap['parentList']" role="treeitem" class="blocklyHasChildren"
        [attr.aria-labelledBy]="generateAriaLabelledByAttr('blockly-block-summary', idMap['blockSummary'])"
        [attr.aria-level]="level" aria-selected=false>
      {{checkParentList(parentList)}}
      <label [id]="idMap['blockSummary']">{{block.toString()}}</label>
      <ol role="group"  [attr.aria-level]="level+1">
        <li [id]="idMap['listItem']" class="blocklyHasChildren" role="treeitem"
            [attr.aria-labelledBy]="generateAriaLabelledByAttr('blockly-block-menu', idMap['blockSummary'])"
            [attr.aria-level]="level+1" aria-selected=false>
          <label [id]="idMap['label']">{{'BLOCK_ACTION_LIST'|translate}}</label>
          <ol role="group"  [attr.aria-level]="level+2">
            <li [id]="idMap['cutListItem']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['cutButton'], 'blockly-button')"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['cutButton']" (click)="clipboardService.cut(block)">{{'CUT_BLOCK'|translate}}</button>
            </li>
            <li [id]="idMap['copyListItem']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['copyButton'], 'blockly-button')"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['copyButton']" (click)="clipboardService.copy(block, true)">{{'COPY_BLOCK'|translate}}</button>
            </li>
            <li [id]="idMap['pasteBelow']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['pasteBelowButton'], 'blockly-button', (getNoNextConnectionHTMLText(block)||clipboardService.getClipboardCompatibilityHTMLText(block.nextConnection)))"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['pasteBelowButton']" (click)="clipboardService.pasteFromClipboard(block.nextConnection)"
                  [disabled]="getNoNextConnectionHTMLText(block)" [disabled]="clipboardService.getClipboardCompatibilityHTMLText(block.nextConnection)">{{'PASTE_BELOW'|translate}}</button>
            </li>
            <li [id]="idMap['pasteAbove']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['pasteAboveButton'], 'blockly-button', (getNoPreviousConnectionHTMLText(block) || clipboardService.getClipboardCompatibilityHTMLText(block.previousConnection)))"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['pasteAboveButton']" (click)="clipboardService.pasteFromClipboard(block.previousConnection)"
                  [disabled]="getNoPreviousConnectionHTMLText(block)" [disabled]="clipboardService.getClipboardCompatibilityHTMLText(block.previousConnection)">{{'PASTE_ABOVE'|translate}}</button>
            </li>
            <li [id]="idMap['markBelow']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['markBelowButton'], 'blockly-button', getNoNextConnectionHTMLText(block))"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['markBelowButton']" (click)="clipboardService.markConnection(block.nextConnection)"
                  [disabled]="getNoNextConnectionHTMLText(block)">{{'MARK_SPOT_BELOW'|translate}}</button>
            </li>
            <li [id]="idMap['markAbove']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['markAboveButton'], 'blockly-button', getNoPreviousConnectionHTMLText(block))"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['markAboveButton']" (click)="clipboardService.markConnection(block.previousConnection)"
                  [disabled]="getNoPreviousConnectionHTMLText(block)">{{'MARK_SPOT_ABOVE'|translate}}</button>
            </li>
            <li [id]="idMap['sendToSelectedListItem']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['sendToSelectedButton'], 'blockly-button', utilsService.getMarkedBlockCompatibilityHTMLText(clipboardService.isBlockCompatibleWithMarkedConnection(block)))"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['sendToSelectedButton']" (click)="sendToSelected(block)"
                  [disabled]="getMarkedBlockCompatibilityHTMLText(clipboardService.isBlockCompatibleWithMarkedConnection(block))">{{'MOVE_TO_MARKED_SPOT'|translate}}</button>
            </li>
            <li [id]="idMap['delete']" role="treeitem"
                [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['deleteButton'], 'blockly-button')"
                [attr.aria-level]="level+2" aria-selected=false>
              <button [id]="idMap['deleteButton']" (click)="deleteBlock(block)">{{'DELETE'|translate}}</button>
            </li>
          </ol>
        </li>
        <div *ngFor="#inputBlock of block.inputList; #i = index">
          <field-view *ngFor="#field of inputBlock.fieldRow" [field]="field"></field-view>
          <tree-view *ngIf="inputBlock.connection && inputBlock.connection.targetBlock()" [block]="inputBlock.connection.targetBlock()" [isTopBlock]="false" [level]="level"></tree-view>
          <li #inputList [attr.aria-level]="level + 1" [id]="idMap['inputList' + i]"
              [attr.aria-labelledBy]="generateAriaLabelledByAttr('blockly-menu', idMap['inputMenuLabel' + i])"
              *ngIf="inputBlock.connection && !inputBlock.connection.targetBlock()" (keydown)="treeService.onKeypress($event, tree)">
            <!-- TODO(madeeha): i18n here will need to happen in a different way due to the way grammar changes based on language. -->
            <label [id]="idMap['inputMenuLabel' + i]"> {{utilsService.getInputTypeLabel(inputBlock.connection)}} {{utilsService.getBlockTypeLabel(inputBlock)}} needed: </label>
            <ol role="group"  [attr.aria-level]="level+2">
              <li [id]="idMap['markSpot' + i]" role="treeitem"
                  [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['markButton' + i], 'blockly-button')"
                  [attr.aria-level]="level + 2" aria-selected=false>
                <button [id]="idMap['markSpotButton + i']" (click)="clipboardService.markConnection(inputBlock.connection)">{{'MARK_THIS_SPOT'|translate}}</button>
              </li>
              <li [id]="idMap['paste' + i]" role="treeitem"
                  [attr.aria-labelledBy]="generateAriaLabelledByAttr(idMap['pasteButton' + i], 'blockly-button', clipboardService.getClipboardCompatibilityHTMLText(inputBlock.connection))"
                  [attr.aria-level]="level+2" aria-selected=false>
                <button [id]="idMap['pasteButton' + i]" (click)="clipboardService.pasteFromClipboard(inputBlock.connection)"
                    [disabled]="clipboardService.getClipboardCompatibilityHTMLText(inputBlock.connection)">{{'PASTE'|translate}}</button>
              </li>
            </ol>
          </li>
        </div>
      </ol>
    </li>
    <tree-view *ngIf= "block.nextConnection && block.nextConnection.targetBlock()"
               [block]="block.nextConnection.targetBlock()"
               [isTopBlock]="false"
               [level]="level">
    </tree-view>
    `,
    directives: [ng.core.forwardRef(function() {
      return blocklyApp.WorkspaceTreeView;
    }), blocklyApp.FieldView],
    inputs: ['block', 'isTopBlock', 'topBlockIndex', 'level', 'parentId'],
    pipes: [blocklyApp.TranslatePipe],
    providers: [blocklyApp.TreeService],
  })
  .Class({
    constructor: [
        blocklyApp.ClipboardService, blocklyApp.TreeService, blocklyApp.UtilsService,
        function(_clipboardService, _treeService, _utilsService) {
      this.infoBlocks = Object.create(null);
      this.clipboardService = _clipboardService;
      this.treeService = _treeService;
      this.utilsService = _utilsService;
    }],
    deleteBlock: function(block) {
      // If this is the top block, we should shift focus to the previous tree
      var topBlocks = blocklyApp.workspace.topBlocks_;
      for (var i = 0; i < topBlocks.length; i++) {
        if (topBlocks[i].id == block.id) {
          this.treeService.goToPreviousTree(this.parentId);
          break;
        }
      }

      // If this is not the top block, we should change the active descendant
      // of the tree.
      block.dispose(true);
    },
    getMarkedBlockCompatibilityHTMLText: function(isCompatible) {
      return this.utilsService.getMarkedBlockCompatibilityHTMLText(isCompatible);
    },
    generateAriaLabelledByAttr: function() {
      return this.utilsService.generateAriaLabelledByAttr.apply(
          this, arguments);
    },
    ngOnInit: function() {
      var elementsNeedingIds = ['blockSummary', 'listItem', 'label',
          'cutListItem', 'cutButton', 'copyListItem', 'copyButton',
          'pasteBelow', 'pasteBelowButton', 'pasteAbove', 'pasteAboveButton',
          'markBelow', 'markBelowButton', 'markAbove', 'markAboveButton',
          'sendToSelectedListItem', 'sendToSelectedButton', 'delete',
          'deleteButton'];
      for (var i = 0; i < this.block.inputList.length; i++) {
        var inputBlock = this.block.inputList[i];
        if (inputBlock.connection && !inputBlock.connection.targetBlock()) {
          elementsNeedingIds = elementsNeedingIds.concat(
            ['inputList' + i, 'inputMenuLabel' + i, 'markSpot' + i,
             'markSpotButton' + i, 'paste' + i, 'pasteButton' + i]);
        }
      }
      this.idMap = this.utilsService.generateIds(elementsNeedingIds);
      this.idMap['parentList'] = this.generateParentListId();
    },
    generateParentListId: function() {
      if (this.isTopBlock) {
        return this.parentId + '-node0'
      } else {
        return this.utilsService.generateUniqueId();
      }
    },
    getNoPreviousConnectionHTMLText: function(block) {
      if (!block.previousConnection) {
        return 'blockly-disabled';
      } else {
        return '';
      }
    },
    getNoNextConnectionHTMLText: function(block) {
      if (!block.nextConnection) {
        return 'blockly-disabled';
      } else {
        return '';
      }
    },
    checkParentList: function(parentList) {
      blocklyApp.debug && console.log('setting parent list');
      var tree = parentList;
      var regex = /^blockly-workspace-tree\d+$/;
      while (tree && !tree.id.match(regex)) {
        tree = tree.parentNode;
      }
      if (tree && tree.getAttribute('aria-activedescendant') == parentList.id) {
        this.treeService.updateSelectedNode(parentList, tree, false);
      }
    },
    sendToSelected: function(block) {
      if (this.clipboardService) {
        this.clipboardService.pasteToMarkedConnection(block, false);
        block.dispose(true);
        alert('Block moved to marked spot: ' + block.toString());
      }
    }
  });
